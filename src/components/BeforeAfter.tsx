import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { MoveHorizontal, Info } from 'lucide-react';
import type { Transformation } from '../data/transformation';

/**
 * Draggable before / after comparison. Works with mouse, touch and pen
 * (pointer events) and with the keyboard (arrow keys, Home / End).
 */
export function BeforeAfter({ data }: { data: Transformation }) {
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const stop = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current && e.type === 'pointerup') setFromClientX(e.clientX);
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setPos((p) => Math.max(0, p - step));
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setPos((p) => Math.min(100, p + step));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  };

  const beforeLabel = data.illustrative ? 'Line study' : data.beforeLabel;
  const afterLabel = data.illustrative ? 'Finished artwork' : data.afterLabel;

  return (
    <figure className="ba">
      <div
        ref={boxRef}
        className="ba-box"
        style={{ aspectRatio: `${data.width} / ${data.height}`, ['--pos' as string]: `${pos}%` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
      >
        <img className="ba-img" src={data.after} alt={`${afterLabel}: ${data.alt}`} width={data.width} height={data.height} loading="lazy" draggable={false} />
        <div className="ba-before" aria-hidden="true">
          <img
            className={`ba-img ${data.illustrative ? 'ba-img--study' : ''}`}
            src={data.before}
            alt=""
            width={data.width}
            height={data.height}
            loading="lazy"
            draggable={false}
          />
        </div>
        <span className="ba-label ba-label--before">{beforeLabel}</span>
        <span className="ba-label ba-label--after">{afterLabel}</span>
        <div
          className="ba-handle"
          role="slider"
          tabIndex={0}
          aria-label={`Compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% ${beforeLabel.toLowerCase()}`}
          onKeyDown={onKeyDown}
        >
          <span className="ba-knob">
            <MoveHorizontal size={20} aria-hidden />
          </span>
        </div>
      </div>
      {data.illustrative && (
        <figcaption className="ba-note">
          <Info size={15} aria-hidden />
          Illustrative preview: the left side is a pencil-style rendering of the finished piece, not a customer's original photo.
        </figcaption>
      )}
    </figure>
  );
}
