import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { prefersReducedMotion } from '../utils/motion';

type Props = { src: string; poster: string; label: string; className?: string };

/**
 * Silent looping studio clip. Plays only while on screen, never autoplays for
 * reduced-motion users, and always offers a visible pause / play control.
 */
export function VideoFrame({ src, poster, label, className = '' }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused) {
          video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [userPaused]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      setUserPaused(true);
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={`video-frame ${className}`}>
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} />
      <button type="button" className="video-toggle" onClick={toggle} aria-label={playing ? `Pause video: ${label}` : `Play video: ${label}`}>
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </div>
  );
}
