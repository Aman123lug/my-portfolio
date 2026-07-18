import { useEffect, useRef } from 'react';
import './NeuralNetwork.css';

const LAYERS = [4, 6, 8, 6, 3];
const PERSPECTIVE = 650;

interface NodeP {
  x: number;
  y: number;
  z: number;
  layer: number;
  glow: number;
  sx: number;
  sy: number;
  scale: number;
}

interface Edge {
  a: number;
  b: number;
}

interface Pulse {
  edge: number;
  t: number;
  speed: number;
}

// deterministic pseudo-random so the layout is stable across renders
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function NeuralNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let raf = 0;

    const nodes: NodeP[] = [];
    const edges: Edge[] = [];
    const pulses: Pulse[] = [];
    const layerStart: number[] = [];

    // build structure in unit space, scaled on resize
    let idx = 0;
    LAYERS.forEach((count, layer) => {
      layerStart.push(idx);
      for (let i = 0; i < count; i++) {
        const spreadY = count > 1 ? (i / (count - 1)) * 2 - 1 : 0;
        nodes.push({
          x: (layer / (LAYERS.length - 1)) * 2 - 1,
          y: spreadY,
          z: rand(idx) * 2 - 1,
          layer,
          glow: 0,
          sx: 0,
          sy: 0,
          scale: 1,
        });
        idx++;
      }
    });

    for (let l = 0; l < LAYERS.length - 1; l++) {
      for (let i = 0; i < LAYERS[l]; i++) {
        for (let j = 0; j < LAYERS[l + 1]; j++) {
          edges.push({ a: layerStart[l] + i, b: layerStart[l + 1] + j });
        }
      }
    }

    // edges leaving each node, for chaining pulses forward
    const edgesFrom: number[][] = nodes.map(() => []);
    edges.forEach((e, i) => edgesFrom[e.a].push(i));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let mouseX = 0;
    let mouseY = 0;
    let targetMX = 0;
    let targetMY = 0;

    const onMove = (e: MouseEvent) => {
      targetMX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);

    const spawnPulse = (fromNode: number) => {
      const options = edgesFrom[fromNode];
      if (!options.length) return;
      const edge = options[Math.floor(Math.random() * options.length)];
      pulses.push({ edge, t: 0, speed: 0.012 + Math.random() * 0.012 });
    };

    let lastSpawn = 0;
    const start = performance.now();

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMX - mouseX) * 0.04;
      mouseY += (targetMY - mouseY) * 0.04;

      const rotY = Math.sin(t * 0.18) * 0.28 + mouseX * 0.35;
      const rotX = Math.cos(t * 0.14) * 0.1 + mouseY * 0.2;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const spreadX = Math.min(width * 0.36, 480);
      const spreadY = Math.min(height * 0.3, 260);
      const spreadZ = 110;
      const cx = width / 2;
      const cy = height / 2;

      // project all nodes
      for (const n of nodes) {
        const px = n.x * spreadX;
        const py = n.y * spreadY + Math.sin(t * 0.8 + n.x * 3 + n.z * 5) * 6;
        const pz = n.z * spreadZ;

        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;
        const y1 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const f = PERSPECTIVE / (PERSPECTIVE + z2);
        n.sx = cx + x1 * f;
        n.sy = cy + y1 * f;
        n.scale = f;
        n.glow = Math.max(0, n.glow - 0.02);
      }

      // edges
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const depth = (a.scale + b.scale) / 2;
        ctx.strokeStyle = `rgba(212, 165, 116, ${0.05 + depth * 0.07})`;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // pulses
      if (!reducedMotion && t - lastSpawn > 0.35 && pulses.length < 26) {
        lastSpawn = t;
        const inputNode = Math.floor(Math.random() * LAYERS[0]);
        spawnPulse(inputNode);
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        const e = edges[p.edge];
        const a = nodes[e.a];
        const b = nodes[e.b];
        if (p.t >= 1) {
          b.glow = 1;
          spawnPulse(e.b);
          pulses.splice(i, 1);
          continue;
        }
        const x = a.sx + (b.sx - a.sx) * p.t;
        const y = a.sy + (b.sy - a.sy) * p.t;
        const s = a.scale + (b.scale - a.scale) * p.t;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 8 * s);
        grad.addColorStop(0, 'rgba(255, 214, 160, 0.9)');
        grad.addColorStop(1, 'rgba(255, 214, 160, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 8 * s, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes on top
      for (const n of nodes) {
        const r = (n.layer === 0 || n.layer === LAYERS.length - 1 ? 4.5 : 3.2) * n.scale;

        if (n.glow > 0.01) {
          const grad = ctx.createRadialGradient(n.sx, n.sy, 0, n.sx, n.sy, r * 5);
          grad.addColorStop(0, `rgba(255, 214, 160, ${0.5 * n.glow})`);
          grad.addColorStop(1, 'rgba(255, 214, 160, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(224, 178, 128, ${0.35 + n.scale * 0.4 + n.glow * 0.25})`;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={`neural-canvas ${className ?? ''}`} aria-hidden="true" />;
}
