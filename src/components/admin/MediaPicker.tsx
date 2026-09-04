import { useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

import {
  IMAGE_TYPES,
  FileTooLargeError,
  UnsupportedTypeError,
  formatBytes,
  subirArchivo,
  subscribeArchivos,
} from '../../services/archivos';
import type { Archivo } from '../../types/content';

export interface MediaSelection {
  url: string;
  path: string;
}

interface MediaPickerProps {
  onSelect: (selection: MediaSelection) => void;
  onClose: () => void;
}

/**
 * Modal that lets an admin either reuse a file already in the library or
 * upload a new one, returning the public URL plus the storage path.
 *
 * The path travels with the URL so the owning record can delete its own object
 * later instead of orphaning it in the bucket.
 */
export default function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Images only: the library also holds the book's PDF, which is never a valid
  // choice for a portrait or an illustration.
  useEffect(
    () =>
      subscribeArchivos(
        (todos) => setArchivos(todos.filter((archivo) => IMAGE_TYPES.includes(archivo.tipo))),
        (err) => setError(err.message),
      ),
    [],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const uploaded = await subirArchivo(file, setProgress);
      onSelect({ url: uploaded.url, path: uploaded.path });
      onClose();
    } catch (caught) {
      if (caught instanceof FileTooLargeError) setError('El archivo supera el límite de 10 MB.');
      else if (caught instanceof UnsupportedTypeError) setError('Formato no admitido. Usa JPG, PNG, WebP, AVIF o SVG.');
      else setError('No se pudo subir el archivo.');
    } finally {
      setProgress(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Seleccionar imagen"
    >
      <div className="bg-cream rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-stone/20">
          <h2 className="font-fraunces text-xl text-charcoal">Biblioteca de imágenes</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-stone hover:text-terracotta">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 border-b border-stone/20">
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_TYPES.join(',')}
            className="hidden"
            onChange={(event) => handleUpload(event.target.files?.[0])}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={progress !== null}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all disabled:opacity-60"
          >
            <Upload size={16} />
            {progress !== null ? `Subiendo… ${progress}%` : 'Subir nueva imagen'}
          </button>
          {error && <p className="text-terracotta text-sm mt-3">{error}</p>}
        </div>

        <div className="p-6 overflow-y-auto">
          {archivos.length === 0 ? (
            <p className="text-stone text-center py-10">
              La biblioteca está vacía. Sube tu primera imagen.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {archivos.map((archivo) => (
                <button
                  key={archivo.id}
                  onClick={() => {
                    onSelect({ url: archivo.url, path: archivo.path });
                    onClose();
                  }}
                  className="text-left group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-moss/20 border border-stone/20 group-hover:border-penca transition-colors">
                    <img
                      src={archivo.url}
                      alt={archivo.nombre}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-charcoal/70 mt-2 truncate">{archivo.nombre}</p>
                  <p className="text-xs text-stone">{formatBytes(archivo.tamano)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
