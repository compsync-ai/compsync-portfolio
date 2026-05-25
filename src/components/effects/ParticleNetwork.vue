<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import * as THREE from "three";

const props = defineProps({
  variant: {
    type: String,
    default: "light",
    validator: (v) => ["light", "dark"].includes(v)
  },
  particleCount: { type: Number, default: 130 },
  maxConnections: { type: Number, default: 7 },
  connectionDistance: { type: Number, default: 1.6 }
});

const canvasRef = ref(null);

let scene, camera, renderer, points, lineMesh, lineGeometry, linePositions, lineColors;
let rafId = null;
const particles = [];
const mouse = new THREE.Vector2(0, 0);
const mouseTarget = new THREE.Vector2(0, 0);
const tmpVec = new THREE.Vector3();

function palette() {
  if (props.variant === "dark") {
    return {
      particle: new THREE.Color("#2dd4bf"),
      particleSoft: new THREE.Color("#0f8f7a"),
      line: new THREE.Color("#2dd4bf"),
      lineFar: new THREE.Color("#0f8f7a"),
      lineAlpha: 0.34,
      bg: new THREE.Color("#050b0a")
    };
  }
  return {
    particle: new THREE.Color("#0f8f7a"),
    particleSoft: new THREE.Color("#16a085"),
    line: new THREE.Color("#0f8f7a"),
    lineFar: new THREE.Color("#9fe0d4"),
    lineAlpha: 0.22,
    bg: new THREE.Color("#fbfdfc")
  };
}

function setup() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const colors = palette();
  const { clientWidth: w, clientHeight: h } = canvas.parentElement;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
  camera.position.set(0, 0, 6);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);

  // Particles
  const positions = new Float32Array(props.particleCount * 3);
  const sizes = new Float32Array(props.particleCount);
  const pcolors = new Float32Array(props.particleCount * 3);

  for (let i = 0; i < props.particleCount; i++) {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 4;
    const vx = (Math.random() - 0.5) * 0.0035;
    const vy = (Math.random() - 0.5) * 0.0035;
    const vz = (Math.random() - 0.5) * 0.0015;

    particles.push({ x, y, z, vx, vy, vz, idx: i });

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    sizes[i] = 1.4 + Math.random() * 1.6;

    // Mix particle color randomly between two brand stops
    const t = Math.random();
    const c = colors.particle.clone().lerp(colors.particleSoft, t);
    pcolors[i * 3] = c.r;
    pcolors[i * 3 + 1] = c.g;
    pcolors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("particleColor", new THREE.BufferAttribute(pcolors, 3));

  // Soft glowing point shader
  const vertexShader = `
    attribute float size;
    attribute vec3 particleColor;
    varying vec3 vColor;
    void main() {
      vColor = particleColor;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (45.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  const fragmentShader = `
    varying vec3 vColor;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);
      float alpha = smoothstep(0.5, 0.0, d);
      alpha = pow(alpha, 2.4);
      gl_FragColor = vec4(vColor, alpha * 0.9);
    }
  `;
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);

  // Connection lines geometry (we'll repopulate each frame)
  const maxLineSegments = props.particleCount * props.maxConnections;
  lineGeometry = new THREE.BufferGeometry();
  linePositions = new Float32Array(maxLineSegments * 2 * 3);
  lineColors = new Float32Array(maxLineSegments * 2 * 3);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
  lineGeometry.setDrawRange(0, 0);

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: colors.lineAlpha,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineMesh);
}

function tick(time) {
  if (!renderer || !scene || !camera) return;
  const colors = palette();

  // Smooth mouse approach
  mouse.x += (mouseTarget.x - mouse.x) * 0.06;
  mouse.y += (mouseTarget.y - mouse.y) * 0.06;

  // Camera parallax driven by mouse
  camera.position.x = mouse.x * 0.6;
  camera.position.y = mouse.y * 0.4;
  camera.lookAt(0, 0, 0);

  // Update particle positions
  const posAttr = points.geometry.getAttribute("position");
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    // gentle wrap
    if (p.x > 5.2) p.x = -5.2;
    if (p.x < -5.2) p.x = 5.2;
    if (p.y > 3.2) p.y = -3.2;
    if (p.y < -3.2) p.y = 3.2;
    if (p.z > 2.2) p.z = -2.2;
    if (p.z < -2.2) p.z = 2.2;

    // Cursor repulsion
    const dx = p.x - mouse.x * 4;
    const dy = p.y - mouse.y * 2.5;
    const distSq = dx * dx + dy * dy;
    if (distSq < 1.2) {
      const f = (1.2 - distSq) * 0.0015;
      p.vx += (dx / Math.sqrt(distSq + 0.0001)) * f;
      p.vy += (dy / Math.sqrt(distSq + 0.0001)) * f;
    }
    // velocity damping
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.vz *= 0.985;

    posAttr.setXYZ(p.idx, p.x, p.y, p.z);
  }
  posAttr.needsUpdate = true;

  // Rebuild connections
  let lineIndex = 0;
  const distSqCutoff = props.connectionDistance * props.connectionDistance;
  for (let i = 0; i < particles.length; i++) {
    let connections = 0;
    for (let j = i + 1; j < particles.length; j++) {
      if (connections >= props.maxConnections) break;
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < distSqCutoff) {
        const alpha = 1 - Math.sqrt(d2) / props.connectionDistance;
        const idx = lineIndex * 2 * 3;
        linePositions[idx] = a.x;
        linePositions[idx + 1] = a.y;
        linePositions[idx + 2] = a.z;
        linePositions[idx + 3] = b.x;
        linePositions[idx + 4] = b.y;
        linePositions[idx + 5] = b.z;

        const cA = colors.line.clone().multiplyScalar(alpha);
        const cB = colors.lineFar.clone().multiplyScalar(alpha);
        lineColors[idx] = cA.r;
        lineColors[idx + 1] = cA.g;
        lineColors[idx + 2] = cA.b;
        lineColors[idx + 3] = cB.r;
        lineColors[idx + 4] = cB.g;
        lineColors[idx + 5] = cB.b;

        lineIndex++;
        connections++;
      }
    }
  }
  lineGeometry.attributes.position.needsUpdate = true;
  lineGeometry.attributes.color.needsUpdate = true;
  lineGeometry.setDrawRange(0, lineIndex * 2);

  renderer.render(scene, camera);
  rafId = requestAnimationFrame(tick);
}

function onResize() {
  if (!renderer || !canvasRef.value) return;
  const parent = canvasRef.value.parentElement;
  if (!parent) return;
  const { clientWidth: w, clientHeight: h } = parent;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}

function onPointerMove(e) {
  const rect = canvasRef.value.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  mouseTarget.x = x;
  mouseTarget.y = y;
}

function onPointerLeave() {
  mouseTarget.x = 0;
  mouseTarget.y = 0;
}

onMounted(() => {
  setup();
  rafId = requestAnimationFrame(tick);
  window.addEventListener("resize", onResize);
  const parent = canvasRef.value?.parentElement;
  if (parent) {
    parent.addEventListener("pointermove", onPointerMove);
    parent.addEventListener("pointerleave", onPointerLeave);
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener("resize", onResize);
  const parent = canvasRef.value?.parentElement;
  if (parent) {
    parent.removeEventListener("pointermove", onPointerMove);
    parent.removeEventListener("pointerleave", onPointerLeave);
  }
  if (renderer) {
    renderer.dispose();
    points?.geometry.dispose();
    points?.material.dispose();
    lineGeometry?.dispose();
    lineMesh?.material.dispose();
  }
});
</script>

<template>
  <canvas ref="canvasRef" class="particle-network" aria-hidden="true"></canvas>
</template>

<style scoped>
.particle-network {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
</style>
