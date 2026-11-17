// The light tunnel: glowing points on 20 arches plus the red-carpet edges, drawn by Three.js in one
// draw call (1,948 points). Loaded after the visitor's first interaction, in idle time (well after first paint).
//  - Desktop: the camera walks forward as the visitor scrolls through the (sticky) section.
//  - Phones: no scroll link at all. The camera drifts forward on its own and stops at the exit, where
//    the neon name lights up; tilting the phone leans the view (Android; no permission prompt).
//  - Rendering stops whenever the canvas is off screen, and the pixel ratio is capped at 1.5.
import {
  WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute, Points, ShaderMaterial,
  AdditiveBlending, Color,
} from 'three';

const ARCHES = 18, PER_ARCH = 96, CARPET = 110, GAP = 0.95;
const START_Z = 3.2, END_Z = -(ARCHES - 4) * GAP; // ends inside the last arches, facing the name

function geometry() {
  const n = ARCHES * PER_ARCH + CARPET * 2;
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), seed = new Float32Array(n);
  const warm = new Color('#fff1c9'), gold = new Color('#ffd27a'), red = new Color('#ff5a3c');
  let k = 0;
  const put = (x, y, z, c) => { pos.set([x, y, z], k * 3); col.set([c.r, c.g, c.b], k * 3); seed[k] = Math.random(); k++; };
  // Each arch: two straight sides (1.5 high) and a half-circle top (radius 1.15), points spread evenly.
  const side = 1.5, r = 1.15, len = side * 2 + Math.PI * r;
  for (let a = 0; a < ARCHES; a++) {
    const z = -a * GAP;
    for (let i = 0; i < PER_ARCH; i++) {
      let s = ((i + Math.random() * 0.35) / PER_ARCH) * len, x, y;
      if (s < side) { x = -r; y = s; }
      else if (s < side + Math.PI * r) { const t = (s - side) / r; x = -r * Math.cos(t); y = side + r * Math.sin(t); }
      else { x = r; y = side - (s - side - Math.PI * r); }
      put(x + (Math.random() - 0.5) * 0.06, y, z + (Math.random() - 0.5) * 0.08, Math.random() < 0.18 ? gold : warm);
    }
  }
  for (let i = 0; i < CARPET; i++) {
    const z = 1.5 - (i / CARPET) * (ARCHES * GAP + 1);
    put(-0.42, 0.01, z, red); put(0.42, 0.01, z, red);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setAttribute('color', new BufferAttribute(col, 3));
  g.setAttribute('seed', new BufferAttribute(seed, 1));
  return g;
}

const material = (dpr) => new ShaderMaterial({
  transparent: true, depthWrite: false, blending: AdditiveBlending, vertexColors: true,
  uniforms: { uTime: { value: 0 }, uSize: { value: 64 * dpr } },
  vertexShader: `
    attribute float seed; uniform float uTime; uniform float uSize; varying vec3 vColor; varying float vFade;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float d = -mv.z;
      vFade = smoothstep(26.0, 3.0, d) * (0.55 + 0.45 * sin(uTime * 2.2 + seed * 40.0));
      vColor = color;
      gl_PointSize = uSize * (0.55 + seed * 0.5) / max(d, 0.4);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    varying vec3 vColor; varying float vFade;
    void main() {
      float r = length(gl_PointCoord - 0.5);
      float core = smoothstep(0.16, 0.0, r), halo = smoothstep(0.5, 0.0, r);
      gl_FragColor = vec4(vColor * (core * 1.8 + halo * halo * 0.75) * vFade, 1.0);
    }`,
});

export function startTunnel(root) {
  const canvas = root.querySelector('canvas');
  const desktop = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  let renderer;
  try { renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' }); }
  catch { return; } // no WebGL: the real tunnel photo stays
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x050806, 1); // same as the band background
  const scene = new Scene(), cam = new PerspectiveCamera(62, 1, 0.05, 40);
  const mat = material(dpr);
  scene.add(new Points(geometry(), mat));
  renderer.compile(scene, cam); // compile the shaders now, not on the first visible frame

  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
  };
  size();
  new ResizeObserver(size).observe(canvas);
  cam.position.set(0, 1.25, START_Z); cam.lookAt(0, 1.3, START_Z - 4);
  renderer.render(scene, cam); // warm-up draw in idle time: finishes shader linking and buffer upload now

  let progress = 0, target = 0, tiltX = 0, tiltY = 0, visible = false, raf = 0, last = 0, walked = 0, moving = false, rest = 0;
  const name = root.querySelector('[data-tun-name]');
  const endZ = desktop ? END_Z : END_Z + 4.5; // a tall phone screen needs a few arches in front to frame the name

  if (desktop) {
    // Scroll position through the tall section -> 0..1. Read only while the section is on screen.
    const read = () => { const r = root.getBoundingClientRect(); target = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); };
    addEventListener('scroll', () => { if (visible) read(); }, { passive: true });
    read();
  } else {
    addEventListener('deviceorientation', (e) => {
      if (!visible || e.gamma == null) return;
      tiltX = Math.max(-1, Math.min(1, e.gamma / 30)); tiltY = Math.max(-1, Math.min(1, (e.beta - 45) / 40));
    }, { passive: true });
    // While a finger is down or the page is still gliding, the tunnel holds its frame so the scroll gets the
    // whole phone. It resumes when the scroll ends (or 1.5 s after the finger lifts, if it never scrolled).
    const resume = () => { moving = false; clearTimeout(rest); };
    addEventListener('touchstart', () => { moving = true; clearTimeout(rest); }, { passive: true });
    addEventListener('touchend', () => { rest = setTimeout(resume, 1500); }, { passive: true });
    addEventListener('scrollend', resume, { passive: true });
  }

  const frame = (now) => {
    raf = 0;
    if (!visible) return;
    // Phones draw at most 30 frames a second; desktop runs at the display rate.
    if (!desktop && (moving || now - last < 32)) { if (moving) last = now; raf = requestAnimationFrame(frame); return; }
    if (!desktop) { walked += Math.min(now - last, 250); target = Math.min(1, walked / 9000); } // a 9-second walk by the clock, then rest at the exit
    last = now;
    progress = desktop ? progress + (target - progress) * 0.12 : target; // phones: time-based, so slow frame rates still arrive on time
    const e = 1 - Math.pow(1 - progress, 2);
    cam.position.set(tiltX * 0.25 + Math.sin(now / 2400) * 0.04, 1.25 - tiltY * 0.15, START_Z + (endZ - START_Z) * e);
    cam.lookAt(tiltX * 0.4, 1.3, cam.position.z - 4);
    mat.uniforms.uTime.value = now / 1000;
    renderer.render(scene, cam);
    if (name) name.classList.toggle('on', progress > 0.86);
    raf = requestAnimationFrame(frame);
  };

  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible && !raf) { root.classList.add('live'); raf = requestAnimationFrame(frame); }
  }, { threshold: desktop ? 0 : 0.35 }).observe(root);
}
