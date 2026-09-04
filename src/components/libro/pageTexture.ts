import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';

import { INK, MARGIN, PAGE_H, PAGE_W, type Pagina } from './paginas';

/**
 * Draws a page onto a canvas and hands back a texture.
 *
 * Text on a WebGL page is pixels, not glyphs — which is exactly why the chapter
 * pages at /libro/capitulo-N exist alongside this reader. Everything here is
 * about making those pixels look like paper; everything indexable, selectable
 * or readable by a screen reader lives on the HTML side.
 *
 * Memory is the real constraint. Fifty uncapped 2048² RGBA faces is roughly
 * 840 MB of VRAM and will take down mobile Safari, so the cache holds only the
 * spreads near the reader and disposes the rest — `dispose()`, not merely
 * dropping the reference, since three.js keeps GPU handles otherwise.
 */

/** Desktop gets crisp text; phones get a size their GPU can actually hold. */
export function resolucionPagina(): number {
  if (typeof window === 'undefined') return 1024;
  return window.innerWidth < 768 ? 1024 : 2048;
}

const FUENTE_TITULO = (px: number) => `600 ${px}px Fraunces, Georgia, serif`;
const FUENTE_CUERPO = '30px "Nunito Sans", sans-serif';
const FUENTE_ETIQUETA = '600 22px "Nunito Sans", sans-serif';

const ETIQUETA_TEXTO: Record<string, string> = {
  sabias: '¿Sabías que?',
  consejo: 'Consejo de taller',
  paso: 'El oficio, paso a paso',
  modulo: 'Plan de estudios',
};

function fondo(ctx: CanvasRenderingContext2D, color: string = INK.cream) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  // A faint fibre grain, so a flat fill does not read as plastic.
  ctx.globalAlpha = 0.035;
  ctx.strokeStyle = INK.earth;
  ctx.lineWidth = 1;
  for (let y = 0; y < PAGE_H; y += 7) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y * 0.35) * 2);
    ctx.lineTo(PAGE_W, y + Math.cos(y * 0.22) * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** Running head plus the folio rule, shared by every interior page. */
function encabezado(ctx: CanvasRenderingContext2D, texto: string, folio: number) {
  if (texto) {
    ctx.font = FUENTE_ETIQUETA;
    ctx.fillStyle = INK.stone;
    ctx.textAlign = 'left';
    const recortado = texto.length > 54 ? `${texto.slice(0, 52)}…` : texto;
    ctx.fillText(recortado.toUpperCase(), MARGIN, MARGIN);
  }

  ctx.strokeStyle = INK.stone;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(MARGIN, MARGIN + 22);
  ctx.lineTo(PAGE_W - MARGIN, MARGIN + 22);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.font = FUENTE_ETIQUETA;
  ctx.fillStyle = INK.stone;
  ctx.textAlign = 'center';
  ctx.fillText(String(folio), PAGE_W / 2, PAGE_H - MARGIN + 16);
  ctx.textAlign = 'left';
}

function lineasDeTexto(ctx: CanvasRenderingContext2D, lineas: string[], y0: number) {
  ctx.font = FUENTE_CUERPO;
  ctx.fillStyle = INK.charcoal;
  let y = y0;
  for (const linea of lineas) {
    if (linea) ctx.fillText(linea, MARGIN, y);
    y += 46;
  }
}

/** Wraps a heading at a given size, returning the y it ends at. */
function titulo(
  ctx: CanvasRenderingContext2D,
  texto: string,
  y0: number,
  px: number,
  color: string,
): number {
  ctx.font = FUENTE_TITULO(px);
  ctx.fillStyle = color;

  const ancho = PAGE_W - MARGIN * 2;
  const palabras = texto.split(/\s+/);
  let linea = '';
  let y = y0;

  for (const palabra of palabras) {
    const tentativa = linea ? `${linea} ${palabra}` : palabra;
    if (ctx.measureText(tentativa).width <= ancho) {
      linea = tentativa;
    } else {
      ctx.fillText(linea, MARGIN, y);
      y += px * 1.18;
      linea = palabra;
    }
  }
  if (linea) {
    ctx.fillText(linea, MARGIN, y);
    y += px * 1.18;
  }
  return y;
}

function dibujar(ctx: CanvasRenderingContext2D, pagina: Pagina, folio: number) {
  switch (pagina.kind) {
    case 'portada': {
      fondo(ctx, INK.fique);
      ctx.textAlign = 'center';
      ctx.font = FUENTE_ETIQUETA;
      ctx.fillStyle = INK.earth;
      ctx.fillText(pagina.editor.toUpperCase(), PAGE_W / 2, 380);
      ctx.textAlign = 'left';

      let y = titulo(ctx, pagina.titulo, 520, 96, INK.charcoal);

      ctx.strokeStyle = INK.terracotta;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(MARGIN, y + 30);
      ctx.lineTo(MARGIN + 160, y + 30);
      ctx.stroke();

      y += 110;
      ctx.font = FUENTE_CUERPO;
      ctx.fillStyle = INK.charcoal;
      lineasDeTexto(ctx, wrapSimple(ctx, pagina.subtitulo), y);

      ctx.font = FUENTE_ETIQUETA;
      ctx.fillStyle = INK.earth;
      ctx.fillText(pagina.version.toUpperCase(), MARGIN, PAGE_H - MARGIN);
      break;
    }

    case 'parte': {
      fondo(ctx, INK.earth);
      ctx.font = FUENTE_ETIQUETA;
      ctx.fillStyle = INK.fique;
      ctx.fillText(`PARTE ${pagina.numero}`, MARGIN, 420);
      const y = titulo(ctx, pagina.titulo, 500, 76, INK.cream);
      ctx.font = FUENTE_CUERPO;
      ctx.fillStyle = INK.fique;
      lineasDeTexto(ctx, wrapSimple(ctx, pagina.subtitulo), y + 30);
      break;
    }

    case 'capitulo': {
      fondo(ctx);
      encabezado(ctx, '', folio);
      ctx.font = FUENTE_ETIQUETA;
      ctx.fillStyle = INK.penca;
      ctx.fillText(pagina.eyebrow.toUpperCase(), MARGIN, 400);
      titulo(ctx, pagina.titulo, 480, 62, INK.charcoal);
      break;
    }

    case 'texto': {
      fondo(ctx);
      encabezado(ctx, pagina.eyebrow, folio);
      lineasDeTexto(ctx, pagina.lineas, MARGIN + 110);
      break;
    }

    case 'callout': {
      fondo(ctx);
      encabezado(ctx, pagina.eyebrow, folio);

      const esConsejo = pagina.etiqueta === 'consejo';
      const acento = esConsejo ? INK.terracotta : INK.penca;

      ctx.fillStyle = esConsejo ? 'rgba(184,92,56,0.07)' : 'rgba(143,168,120,0.14)';
      ctx.fillRect(MARGIN - 30, MARGIN + 80, PAGE_W - MARGIN * 2 + 60, PAGE_H - MARGIN * 2 - 120);

      ctx.font = FUENTE_ETIQUETA;
      ctx.fillStyle = acento;
      ctx.fillText(
        (ETIQUETA_TEXTO[pagina.etiqueta] ?? '').toUpperCase(),
        MARGIN,
        MARGIN + 160,
      );

      const y = titulo(ctx, pagina.titulo, MARGIN + 230, 46, INK.charcoal);
      lineasDeTexto(ctx, pagina.lineas, y + 30);
      break;
    }

    case 'figura': {
      fondo(ctx);
      encabezado(ctx, pagina.eyebrow, folio);

      // No photography has been delivered, so the slot is drawn as a labelled
      // frame naming the asset tag the client's own catalogue uses.
      const alto = 620;
      const y0 = MARGIN + 130;
      ctx.strokeStyle = INK.stone;
      ctx.setLineDash([12, 10]);
      ctx.lineWidth = 2;
      ctx.strokeRect(MARGIN, y0, PAGE_W - MARGIN * 2, alto);
      ctx.setLineDash([]);

      ctx.textAlign = 'center';
      ctx.font = FUENTE_ETIQUETA;
      ctx.fillStyle = INK.stone;
      ctx.fillText(pagina.tag, PAGE_W / 2, y0 + alto / 2);
      ctx.textAlign = 'left';

      const y = titulo(ctx, pagina.titulo, y0 + alto + 80, 40, INK.earth);
      ctx.font = FUENTE_CUERPO;
      ctx.fillStyle = INK.stone;
      lineasDeTexto(ctx, wrapSimple(ctx, pagina.pie), y + 20);
      break;
    }

    case 'colofon': {
      fondo(ctx, INK.fique);
      ctx.font = FUENTE_ETIQUETA;
      ctx.fillStyle = INK.earth;
      ctx.fillText(pagina.titulo.toUpperCase(), MARGIN, MARGIN + 60);
      lineasDeTexto(ctx, pagina.lineas, MARGIN + 180);
      break;
    }
  }
}

/** Body-font wrap helper for the few places that wrap at draw time. */
function wrapSimple(ctx: CanvasRenderingContext2D, texto: string): string[] {
  ctx.font = FUENTE_CUERPO;
  const ancho = PAGE_W - MARGIN * 2;
  const lineas: string[] = [];
  let actual = '';
  for (const palabra of texto.split(/\s+/)) {
    const tentativa = actual ? `${actual} ${palabra}` : palabra;
    if (ctx.measureText(tentativa).width <= ancho) actual = tentativa;
    else {
      lineas.push(actual);
      actual = palabra;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

const cache = new Map<number, Texture>();

/** Texture for a page index, drawn on first request and cached. */
export function texturaDePagina(indice: number, pagina: Pagina): Texture {
  const existente = cache.get(indice);
  if (existente) return existente;

  const escala = resolucionPagina() / PAGE_W;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(PAGE_W * escala);
  canvas.height = Math.round(PAGE_H * escala);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  ctx.scale(escala, escala);
  ctx.textBaseline = 'alphabetic';

  dibujar(ctx, pagina, indice);

  const textura = new CanvasTexture(canvas);
  textura.colorSpace = SRGBColorSpace;
  textura.anisotropy = 4;
  textura.needsUpdate = true;

  cache.set(indice, textura);
  return textura;
}

/**
 * Frees every cached page outside `[desde, hasta]`.
 *
 * Called as the reader moves so memory plateaus instead of climbing — the
 * failure mode that only shows up on a real phone, halfway through the book.
 */
export function podarTexturas(desde: number, hasta: number) {
  for (const [indice, textura] of cache) {
    if (indice < desde || indice > hasta) {
      textura.dispose();
      cache.delete(indice);
    }
  }
}

/** Drops everything. Used when the reader unmounts. */
export function liberarTexturas() {
  for (const textura of cache.values()) textura.dispose();
  cache.clear();
}
