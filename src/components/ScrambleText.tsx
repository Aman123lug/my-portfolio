import { useEffect, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01アイウエオ';

interface ScrambleTextProps {
  phrases: string[];
  holdMs?: number;
  startDelayMs?: number;
  className?: string;
}

/**
 * Decodes text with a matrix-style character scramble.
 * One phrase: decodes once and stays. Multiple: rotates forever.
 */
export default function ScrambleText({
  phrases,
  holdMs = 2800,
  startDelayMs = 0,
  className,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    let phraseIdx = 0;

    const scrambleTo = (next: string, onDone: () => void) => {
      const maxLen = next.length;
      // each character resolves at its own frame window
      const slots = Array.from({ length: maxLen }, (_, i) => ({
        char: next[i],
        start: Math.floor(Math.random() * 20),
        end: 20 + Math.floor(Math.random() * 25) + i * 1.5,
      }));
      let frame = 0;

      const tick = () => {
        if (cancelled) return;
        let out = '';
        let done = 0;
        for (const s of slots) {
          if (frame >= s.end) {
            out += s.char;
            done++;
          } else if (frame >= s.start) {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else {
            out += ' ';
          }
        }
        setDisplay(out);
        frame++;
        if (done === slots.length) {
          onDone();
        } else {
          raf = requestAnimationFrame(tick);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const cycle = () => {
      if (cancelled) return;
      scrambleTo(phrases[phraseIdx], () => {
        if (phrases.length <= 1) return;
        timer = setTimeout(() => {
          phraseIdx = (phraseIdx + 1) % phrases.length;
          cycle();
        }, holdMs);
      });
    };

    timer = setTimeout(cycle, startDelayMs);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases.join('|'), holdMs, startDelayMs]);

  return <span className={className}>{display || ' '}</span>;
}
