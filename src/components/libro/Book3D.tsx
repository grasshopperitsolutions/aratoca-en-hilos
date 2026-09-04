import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
  type Texture,
} from 'three';

import { INK, type PaginaConCapitulo } from './paginas';
import { podarTexturas, texturaDePagina } from './pageTexture';

/**
 * The book as a stack of bendable leaves.
 *
 * Each leaf is a skinned mesh: a box divided along its width, with one bone per
 * segment. Rotating the bones progressively is what produces the curl of paper
 * mid-turn — a rigid CSS rotation cannot do that, and it is the whole reason
 * this route carries three.js at all.
 *
 * Bones ease towards their target rather than snapping, so a turn reads as
 * paper under tension instead of a hinge. Crucially the bend is a function of
 * how much rotation is left, not of elapsed time: a leaf that has arrived is
 * perfectly flat and perfectly still. The book must never move on its own.
 */

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.792; // 1000 × 1400 page, to scale
const PAGE_DEPTH = 0.003;
const SEGMENTS = 24;
const SEGMENT_WIDTH = PAGE_WIDTH / SEGMENTS;

/** Shared by every leaf — one geometry, skinned per instance. */
const pageGeometry = new BoxGeometry(PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH, SEGMENTS, 2);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

{
  const position = pageGeometry.attributes.position;
  const vertex = new Vector3();
  const skinIndexes: number[] = [];
  const skinWeights: number[] = [];

  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i);
    const indice = Math.min(SEGMENTS - 1, Math.max(0, Math.floor(vertex.x / SEGMENT_WIDTH)));
    const peso = (vertex.x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
    skinIndexes.push(indice, indice + 1, 0, 0);
    skinWeights.push(1 - peso, peso, 0, 0);
  }

  pageGeometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndexes, 4));
  pageGeometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4));
}

const colorPapel = new Color(INK.cream);
const colorCanto = new Color(INK.fique);

interface HojaProps {
  frente: Texture;
  dorso: Texture;
  /** True once the reader has turned past this leaf. */
  volteada: boolean;
  /**
   * Leaves between this one and the one being read. Zero means this leaf is on
   * top of its half of the stack — the page the reader is actually looking at.
   */
  profundidad: number;
  /** Honours prefers-reduced-motion: pages change without the turn. */
  sinAnimacion: boolean;
}

function Hoja({ frente, dorso, volteada, profundidad, sinAnimacion }: HojaProps) {
  const grupo = useRef<SkinnedMesh>(null);
  const invalidate = useThree((state) => state.invalidate);

  const { mesh, huesos } = useMemo(() => {
    const bones: Bone[] = [];
    for (let i = 0; i <= SEGMENTS; i += 1) {
      const bone = new Bone();
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
      if (i > 0) bones[i - 1].add(bone);
      bones.push(bone);
    }

    const skeleton = new Skeleton(bones);

    // Box material order is [+x, -x, +y, -y, +z, -z]; 4 is the front face and
    // 5 the back, which is where the two page textures go.
    const materials = [
      new MeshStandardMaterial({ color: colorCanto, roughness: 0.95 }),
      new MeshStandardMaterial({ color: colorCanto, roughness: 0.95 }),
      new MeshStandardMaterial({ color: colorCanto, roughness: 0.95 }),
      new MeshStandardMaterial({ color: colorCanto, roughness: 0.95 }),
      new MeshStandardMaterial({ color: colorPapel, map: frente, roughness: 0.9 }),
      new MeshStandardMaterial({ color: colorPapel, map: dorso, roughness: 0.9 }),
    ];

    const skinned = new SkinnedMesh(pageGeometry, materials);
    skinned.castShadow = true;
    skinned.receiveShadow = true;
    skinned.frustumCulled = false;
    skinned.add(bones[0]);
    skinned.bind(skeleton);

    return { mesh: skinned, huesos: bones };
  }, [frente, dorso]);

  useEffect(
    () => () => {
      for (const material of mesh.material as MeshStandardMaterial[]) material.dispose();
      mesh.skeleton.dispose();
    },
    [mesh],
  );

  // Under frameloop="demand" nothing renders until something asks for it, so a
  // new target has to request the frames that animate towards it.
  useEffect(() => invalidate(), [invalidate, volteada]);

  useFrame((_, delta) => {
    const raiz = grupo.current;
    if (!raiz) return;

    // Damping factor that is frame-rate independent; 1 snaps immediately.
    const k = sinAnimacion ? 1 : 1 - Math.pow(0.0001, delta);

    const objetivoRaiz = volteada ? -Math.PI : 0;
    const [raiz0] = huesos;
    const restante = objetivoRaiz - raiz0.rotation.y;

    // How far through the turn we are, and which way it is going. The bend
    // peaks mid-turn and vanishes at either end, which is what stops the book
    // drifting once it has settled.
    const intensidad = Math.min(1, Math.abs(restante) / (Math.PI / 2));
    const sentido = Math.sign(restante);
    let movimiento = Math.abs(restante);

    huesos.forEach((hueso, i) => {
      if (i === 0) {
        hueso.rotation.y += restante * k;
        return;
      }
      const objetivo = sentido * intensidad * Math.sin((i / SEGMENTS) * Math.PI) * 0.14;
      const diferencia = objetivo - hueso.rotation.y;
      hueso.rotation.y += diferencia * k;
      movimiento = Math.max(movimiento, Math.abs(diferencia));
    });

    // Stack by distance from the open spread, not by absolute leaf number:
    // indexing on the latter put later leaves in front of the one being read,
    // so the reader saw a page from further on in the book.
    const z = -profundidad * 0.0055;
    const diferenciaZ = z - raiz.position.z;
    raiz.position.z += diferenciaZ * k;
    movimiento = Math.max(movimiento, Math.abs(diferenciaZ));

    // Keep asking for frames only while something is still moving. Once every
    // leaf has arrived the loop goes quiet and the GPU idles.
    if (movimiento > 0.0004) invalidate();
  });

  return <primitive ref={grupo} object={mesh} />;
}

export interface Book3DProps {
  paginas: PaginaConCapitulo[];
  /** Index of the page currently showing on the right of the spine. */
  posicion: number;
  sinAnimacion: boolean;
  /** False on narrow screens, where one page fills the width instead of two. */
  spread: boolean;
}

export default function Book3D({ paginas, posicion, sinAnimacion, spread }: Book3DProps) {
  const hojas = useMemo(() => {
    const salida: { frenteIdx: number; dorsoIdx: number }[] = [];
    for (let i = 0; i < paginas.length; i += 2) {
      salida.push({ frenteIdx: i, dorsoIdx: Math.min(i + 1, paginas.length - 1) });
    }
    return salida;
  }, [paginas]);

  const hojaActual = Math.ceil(posicion / 2);

  // Centre whichever page is being read. In spread mode the spine is the middle;
  // on a phone the single visible page is, and it sits left or right of the
  // spine depending on whether we are looking at a front or a back.
  const offsetX = spread ? 0 : posicion % 2 === 0 ? -PAGE_WIDTH / 2 : PAGE_WIDTH / 2;

  // Only leaves near the reader keep textures; everything else is released.
  const ventana = 2;
  useEffect(() => {
    const desde = Math.max(0, (hojaActual - ventana) * 2);
    const hasta = Math.min(paginas.length - 1, (hojaActual + ventana) * 2 + 1);
    podarTexturas(desde, hasta);
  }, [hojaActual, paginas.length]);

  return (
    <group rotation-y={spread ? -Math.PI / 24 : 0} position-x={offsetX}>
      {hojas.map((hoja, i) => {
        const distancia = i - hojaActual;
        if (Math.abs(distancia) > ventana + 1) return null;

        // Turned leaves stack leftwards from the most recently turned; the rest
        // stack rightwards from the one currently face up.
        const volteada = i < hojaActual;
        const profundidad = volteada ? hojaActual - 1 - i : i - hojaActual;

        return (
          <Hoja
            key={i}
            profundidad={profundidad}
            volteada={volteada}
            sinAnimacion={sinAnimacion}
            frente={texturaDePagina(hoja.frenteIdx, paginas[hoja.frenteIdx].pagina)}
            dorso={texturaDePagina(hoja.dorsoIdx, paginas[hoja.dorsoIdx].pagina)}
          />
        );
      })}
    </group>
  );
}

export { PAGE_HEIGHT, PAGE_WIDTH };
