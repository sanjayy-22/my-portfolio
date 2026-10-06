import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Both scenes sleep when offscreen, paused, covered by a dialog, or in a hidden tab.
export function createSceneRuntime(container, { position = [0, .3, 8.9], onPlayback = () => {}, onLost = () => {} } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D model. Drag or use arrow keys to rotate. Plus and minus zoom.');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(...position);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  const controls = new OrbitControls(camera, renderer.domElement);
  renderer.domElement.style.touchAction = 'pan-y';
  controls.enableZoom = false; // Keep normal page scrolling over the canvas.
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.autoRotateSpeed = .65;
  controls.rotateSpeed = .55;
  controls.minPolarAngle = Math.PI * .16;
  controls.maxPolarAngle = Math.PI * .8;
  controls.saveState();
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = media.matches, visible = true, covered = false, lost = false, disposed = false;
  let lastFrame = 0, elapsed = 0;
  let frameCallback = () => {};
  const listeners = [];
  function bind(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    listeners.push(() => target.removeEventListener(event, handler, options));
  }
  function render() { if (!lost && !disposed) renderer.render(scene, camera); }
  function frame(now) {
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, .05) : 0;
    lastFrame = now; elapsed += delta;
    controls.update(delta); frameCallback(delta, elapsed); render();
  }
  function updatePlayback() {
    controls.autoRotate = !paused; lastFrame = 0;
    renderer.setAnimationLoop(!paused && visible && !covered && !document.hidden && !lost && !disposed ? frame : null);
    onPlayback(paused); render();
  }
  function setPaused(value) { paused = value; updatePlayback(); }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height || lost || disposed) return;
    camera.aspect = width / height; camera.updateProjectionMatrix();
    renderer.setSize(width, height); render();
  }
  function zoom(factor) {
    const offset = camera.position.clone().sub(controls.target);
    offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, 5.2, 14));
    camera.position.copy(controls.target).add(offset); controls.update(); render();
  }
  function reset() { controls.reset(); render(); }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updatePlayback(); }); visibilityObserver.observe(container);
  bind(media, 'change', event => setPaused(event.matches));
  bind(document, 'visibilitychange', updatePlayback);
  bind(document, 'portfolio:modal', event => { covered = event.detail; updatePlayback(); });
  bind(controls, 'change', () => { if (paused) render(); });
  bind(renderer.domElement, 'keydown', event => {
    if (['+', '=', '-'].includes(event.key)) { event.preventDefault(); zoom(event.key === '-' ? 1.12 : .89); return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    if (event.key === 'ArrowLeft') spherical.theta -= .16;
    if (event.key === 'ArrowRight') spherical.theta += .16;
    if (event.key === 'ArrowUp') spherical.phi -= .12;
    if (event.key === 'ArrowDown') spherical.phi += .12;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
    camera.position.setFromSpherical(spherical).add(controls.target); controls.update(); render();
  });
  bind(renderer.domElement, 'webglcontextlost', event => {
    event.preventDefault(); lost = true; renderer.setAnimationLoop(null);
    renderer.domElement.hidden = true; onLost();
  });
  resize(); updatePlayback();
  return {
    scene, camera, renderer, controls, bind, render, zoom, reset, setPaused,
    get paused() { return paused; },
    get reducedMotion() { return media.matches; },
    onFrame(callback) { frameCallback = callback; },
    dispose() {
      disposed = true; renderer.setAnimationLoop(null);
      resizeObserver.disconnect(); visibilityObserver.disconnect();
      listeners.forEach(remove => remove()); controls.dispose(); disposeObject(scene);
      environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    }
  };
}

export function disposeObject(object) {
  const geometries = new Set(), materials = new Set();
  object.traverse(child => {
    if (child.geometry) geometries.add(child.geometry);
    if (child.material) (Array.isArray(child.material) ? child.material : [child.material]).forEach(material => materials.add(material));
  });
  geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
}
