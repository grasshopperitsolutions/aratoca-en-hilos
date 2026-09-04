import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';

import { PAGE_HEIGHT, PAGE_WIDTH } from './Book3D';

/**
 * Pulls the camera back far enough that the open book always fits.
 *
 * Without this the book overflows on any viewport narrower than it is tall — a
 * fixed camera distance only ever frames one aspect ratio correctly, and a
 * phone in portrait is nowhere near the one a desktop gives you.
 */
export default function Encuadre({ spread }: { spread: boolean }) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;

    const ancho = spread ? PAGE_WIDTH * 2 : PAGE_WIDTH;
    const aspecto = size.width / size.height;
    const media = (camera.fov * Math.PI) / 360; // half fov, in radians

    // Distance needed to fit each axis, plus a margin so the book never touches
    // the edges of the screen or sits under the controls.
    const margen = 1.22;
    const porAlto = (PAGE_HEIGHT * margen) / (2 * Math.tan(media));
    const porAncho = (ancho * margen) / (2 * Math.tan(media) * aspecto);

    camera.position.set(0, 0, Math.max(porAlto, porAncho));
    camera.updateProjectionMatrix();

    // The camera moved outside the render loop, so ask for a frame to show it.
    invalidate();
  }, [camera, size.width, size.height, spread, invalidate]);

  return null;
}
