import { useEffect, useRef, useState, type DragEvent } from 'react';
import { Check, Copy, HardDrive, Trash2, Upload } from 'lucide-react';

import {
  ACCEPTED_TYPES,
  FileTooLargeError,
  MAX_FILE_BYTES,
  UnsupportedTypeError,
  eliminarArchivo,
  formatBytes,
  subirArchivo,
  subscribeArchivos,
} from '../../services/archivos';
import type { Archivo } from '../../types/content';

export default function AdminArchivos() {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => subscribeArchivos(setArchivos, (err) => setError(err.message)), []);

  const totalBytes = archivos.reduce((sum, archivo) => sum + archivo.tamano, 0);

  async function upload(files: FileList | File[] | null | undefined) {
    if (!files) return;
    setError(null);

    for (const file of Array.from(files)) {
      setProgress(0);
      try {
        await subirArchivo(file, setProgress);
      } catch (caught) {
        if (caught instanceof FileTooLargeError) {
          setError(`"${file.name}" supera el límite de ${formatBytes(MAX_FILE_BYTES)}.`);
        } else if (caught instanceof UnsupportedTypeError) {
          setError(`"${file.name}" tiene un formato no admitido.`);
        } else {
          console.error('[admin/archivos] upload failed:', caught);
          setError(`No se pudo subir "${file.name}".`);
        }
      } finally {
        setProgress(null);
      }
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void upload(event.dataTransfer.files);
  }

  async function handleDelete(archivo: Archivo) {
    if (
      !window.confirm(
        `¿Eliminar "${archivo.nombre}"? Si alguna página usa esta imagen, dejará de verse.`,
      )
    ) {
      return;
    }
    await eliminarArchivo(archivo);
  }

  async function copyUrl(archivo: Archivo) {
    await navigator.clipboard.writeText(archivo.url);
    setCopied(archivo.id);
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-fraunces text-charcoal">Archivos</h1>
        <p className="text-charcoal/60 text-sm mt-1 flex items-center gap-2">
          <HardDrive size={14} />
          {archivos.length} archivo{archivos.length === 1 ? '' : 's'} · {formatBytes(totalBytes)} en uso
        </p>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center mb-8 transition-colors ${
          dragging ? 'border-penca bg-moss/10' : 'border-stone/40'
        }`}
      >
        <Upload size={32} className="mx-auto text-stone mb-4" />
        <p className="text-charcoal mb-2">Arrastra imágenes aquí para subirlas</p>
        <p className="text-stone text-sm mb-6">
          JPG, PNG, WebP, AVIF o SVG · máximo {formatBytes(MAX_FILE_BYTES)} por archivo
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={(event) => upload(event.target.files)}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
          className="rounded-full border border-charcoal px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all disabled:opacity-60"
        >
          {progress !== null ? `Subiendo… ${progress}%` : 'Seleccionar archivos'}
        </button>
      </div>

      {error && (
        <p className="border border-terracotta/40 bg-terracotta/5 rounded-lg p-4 text-sm text-charcoal mb-6">
          {error}
        </p>
      )}

      {archivos.length === 0 ? (
        <p className="text-stone py-10 text-center">La biblioteca está vacía.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {archivos.map((archivo) => (
            <figure key={archivo.id} className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-moss/20 border border-stone/20 relative">
                <img
                  src={archivo.url}
                  alt={archivo.nombre}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 p-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-gradient-to-t from-charcoal/70 to-transparent">
                  <button
                    onClick={() => copyUrl(archivo)}
                    aria-label="Copiar URL"
                    title="Copiar URL"
                    className="p-2 rounded-full bg-cream/90 text-charcoal hover:bg-cream"
                  >
                    {copied === archivo.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(archivo)}
                    aria-label="Eliminar"
                    title="Eliminar"
                    className="p-2 rounded-full bg-cream/90 text-terracotta hover:bg-cream"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <figcaption className="mt-2">
                <p className="text-xs text-charcoal/80 truncate" title={archivo.nombre}>
                  {archivo.nombre}
                </p>
                <p className="text-xs text-stone">{formatBytes(archivo.tamano)}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
