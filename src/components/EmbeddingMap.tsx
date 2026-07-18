import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BlogPost } from '../services/hashnode';

const COLORS = ['#d4a574', '#6ee7a0', '#9ecbff', '#c792ea', '#ff8b8b', '#ffd166', '#7fdbda'];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

interface MapNode {
  post: BlogPost;
  cluster: number;
  bx: number; // base position, normalized 0..1
  by: number;
  phase: number;
  r: number;
  sx: number; // projected screen position (updated each frame)
  sy: number;
}

interface Tip {
  x: number;
  y: number;
  post: BlogPost;
  color: string;
}

interface EmbeddingMapProps {
  posts: BlogPost[];
  /** null = no active query (show all); otherwise only these glow */
  matchedIds: Set<string> | null;
}

export default function EmbeddingMap({ posts, matchedIds }: EmbeddingMapProps) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const hoveredRef = useRef<number>(-1);
  const matchedRef = useRef(matchedIds);
  matchedRef.current = matchedIds;

  const { nodes, clusters } = useMemo(() => {
    const tagOf = (p: BlogPost) => p.tags?.[0]?.name ?? 'general';
    const tags = [...new Set(posts.map(tagOf))];
    const k = Math.max(tags.length, 1);

    const built: MapNode[] = posts.map((post) => {
      const cluster = tags.indexOf(tagOf(post));
      const angle = (cluster / k) * Math.PI * 2 - Math.PI / 2;
      const cx = k === 1 ? 0.5 : 0.5 + 0.3 * Math.cos(angle);
      const cy = k === 1 ? 0.5 : 0.5 + 0.27 * Math.sin(angle);
      const h = hash(post.id);
      const jr = 0.05 + ((h % 97) / 97) * 0.11;
      const ja = ((h % 359) / 359) * Math.PI * 2;
      return {
        post,
        cluster,
        bx: Math.min(0.93, Math.max(0.07, cx + jr * Math.cos(ja))),
        by: Math.min(0.88, Math.max(0.12, cy + jr * Math.sin(ja))),
        phase: (h % 100) / 100 * Math.PI * 2,
        r: 6 + Math.min(post.readTimeInMinutes ?? 4, 12) * 0.7,
        sx: 0,
        sy: 0,
      };
    });

    const links: [number, number][] = [];
    for (let a = 0; a < built.length; a++) {
      for (let b = a + 1; b < built.length; b++) {
        if (built[a].cluster === built[b].cluster) links.push([a, b]);
      }
    }

    return {
      nodes: { built, links },
      clusters: tags.map((tag, i) => ({ tag, color: COLORS[i % COLORS.length] })),
    };
  }, [posts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;

    const resize = () => {
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const start = performance.now();
    const { built, links } = nodes;

    const frame = (now: number) => {
      const t = reducedMotion ? 0 : (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      // faint background grid
      ctx.fillStyle = 'rgba(245, 239, 232, 0.04)';
      for (let gx = 20; gx < width; gx += 44) {
        for (let gy = 20; gy < height; gy += 44) {
          ctx.fillRect(gx, gy, 1.5, 1.5);
        }
      }

      const matched = matchedRef.current;
      const alphaOf = (n: MapNode) =>
        matched === null || matched.has(n.post.id) ? 1 : 0.13;

      // update positions
      for (const n of built) {
        n.sx = n.bx * width + Math.sin(t * 0.6 + n.phase) * 6;
        n.sy = n.by * height + Math.cos(t * 0.5 + n.phase * 1.3) * 6;
      }

      // intra-cluster links
      for (const [a, b] of links) {
        const na = built[a];
        const nb = built[b];
        const alpha = 0.1 * Math.min(alphaOf(na), alphaOf(nb));
        ctx.strokeStyle = `rgba(212, 165, 116, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(na.sx, na.sy);
        ctx.lineTo(nb.sx, nb.sy);
        ctx.stroke();
      }

      // nodes
      built.forEach((n, i) => {
        const color = COLORS[n.cluster % COLORS.length];
        const hovered = hoveredRef.current === i;
        const alpha = alphaOf(n);
        const r = hovered ? n.r * 1.35 : n.r;

        const glow = ctx.createRadialGradient(n.sx, n.sy, 0, n.sx, n.sy, r * 3.2);
        glow.addColorStop(0, color + (hovered ? 'aa' : '55'));
        glow.addColorStop(1, color + '00');
        ctx.globalAlpha = alpha;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, r * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, r, 0, Math.PI * 2);
        ctx.fill();

        if (hovered) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, r + 5 + Math.sin(t * 4) * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const hitTest = (mx: number, my: number) => {
      let best = -1;
      let bestD = Infinity;
      built.forEach((n, i) => {
        const d = Math.hypot(mx - n.sx, my - n.sy);
        if (d < n.r + 10 && d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hit = hitTest(mx, my);
      if (hit !== hoveredRef.current) {
        hoveredRef.current = hit;
        if (hit === -1) {
          setTip(null);
          canvas.style.cursor = 'default';
        } else {
          const n = built[hit];
          setTip({
            x: Math.min(Math.max(n.sx + 16, 8), width - 270),
            y: Math.min(Math.max(n.sy - 10, 8), height - 130),
            post: n.post,
            color: COLORS[n.cluster % COLORS.length],
          });
          canvas.style.cursor = 'pointer';
        }
      }
    };

    const onLeave = () => {
      hoveredRef.current = -1;
      setTip(null);
    };

    const onClick = () => {
      const hit = hoveredRef.current;
      if (hit !== -1) navigate(`/blog/${built[hit].post.slug}`);
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [nodes, navigate]);

  return (
    <div className="embed-map" ref={wrapRef}>
      <canvas ref={canvasRef} className="embed-canvas" />
      <span className="embed-axis embed-axis-x">umap_dim_0 →</span>
      <span className="embed-axis embed-axis-y">↑ umap_dim_1</span>

      {tip && (
        <div className="embed-tip" style={{ left: tip.x, top: tip.y, borderColor: tip.color }}>
          <span className="embed-tip-tag" style={{ color: tip.color }}>
            {tip.post.tags?.[0]?.name ?? 'general'}
          </span>
          <span className="embed-tip-title">{tip.post.title}</span>
          <span className="embed-tip-meta">
            {tip.post.readTimeInMinutes} min read · click to open →
          </span>
        </div>
      )}

      <div className="embed-legend">
        {clusters.map((c) => (
          <span key={c.tag} className="embed-legend-item">
            <span className="embed-legend-dot" style={{ background: c.color }}></span>
            {c.tag}
          </span>
        ))}
      </div>
    </div>
  );
}
