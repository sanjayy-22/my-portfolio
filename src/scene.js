import * as THREE from 'three';
import { createSceneRuntime } from './scene-runtime.js';

const colors = { blue: 0x6e98eb, violet: 0xb494ed, mint: 0x66c4aa };

export function initScene() {
  const container = document.querySelector('#three-container');
  const panel = document.querySelector('.hero-scene-controls');
  const motionButton = document.querySelector('#motion-toggle');
  const status = document.querySelector('#sculpture-status');
  function fallback() {
    document.querySelector('.hero-art').classList.remove('ready');
    panel.hidden = true; motionButton.hidden = true;
    document.querySelector('.art-interact').textContent = 'Ideas, interconnected.';
  }
  const runtime = createSceneRuntime(container, {
    onPlayback(paused) {
      motionButton.setAttribute('aria-pressed', String(paused));
      motionButton.setAttribute('aria-label', paused ? 'Play 3D animation' : 'Pause 3D animation');
      motionButton.innerHTML = paused ? '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 7 5-7 5Z" fill="currentColor" stroke="none"/></svg><span>Play motion</span>' : '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 4v8M11 4v8"/></svg><span>Pause motion</span>';
    }, onLost: fallback
  });
  const { scene } = runtime;
  scene.add(new THREE.HemisphereLight(0xe5edff, 0x6580b4, 2));
  const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x608dff, 1.5); rim.position.set(3, -1, 2); scene.add(rim);
  const sculpture = new THREE.Group(); scene.add(sculpture);
  const material = new THREE.MeshPhysicalMaterial({ color: colors.blue, metalness: .48, roughness: .2, clearcoat: 1, clearcoatRoughness: .16, envMapIntensity: 1.2 });
  const geometries = {
    knot: new THREE.TorusKnotGeometry(1.04, .31, 160, 24, 2, 3),
    globe: new THREE.SphereGeometry(1.38, 48, 32),
    crystal: new THREE.IcosahedronGeometry(1.65, 0)
  };
  const core = new THREE.Mesh(geometries.knot, material);
  core.rotation.set(.65, -.18, -.5); sculpture.add(core);
  const globeLines = new THREE.Group();
  const globeMaterial = new THREE.MeshBasicMaterial({ color: 0xe5efff, transparent: true, opacity: .58 });
  for (let i = 0; i < 6; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.39, .007, 5, 100), globeMaterial);
    ring.rotation.y = i * Math.PI / 6; globeLines.add(ring);
  }
  for (let i = -2; i <= 2; i++) {
    const y = i * .39;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(Math.sqrt(1.39 ** 2 - y ** 2), .007, 5, 100), globeMaterial);
    ring.rotation.x = Math.PI / 2; ring.position.y = y; globeLines.add(ring);
  }
  core.add(globeLines); globeLines.visible = false;
  const network = new THREE.Group(); sculpture.add(network);
  const positions = [];
  const goldAngle = Math.PI * (3 - Math.sqrt(5));
  const nodeGeometry = new THREE.SphereGeometry(.04, 10, 8);
  const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0x86a6e7, metalness: .4, roughness: .25 });
  for (let i = 0; i < 42; i++) {
    const y = 1 - i / 41 * 2, r = Math.sqrt(1 - y * y), angle = goldAngle * i;
    const position = new THREE.Vector3(Math.cos(angle) * r * 2.25, y * 2.25, Math.sin(angle) * r * 2.25);
    positions.push(position);
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial); node.position.copy(position);
    if (i % 7 === 0) node.scale.setScalar(1.7);
    network.add(node);
  }
  const lines = [];
  positions.forEach((a, i) => positions.slice(i + 1).forEach(b => { if (a.distanceTo(b) < 1.28) lines.push(a.x, a.y, a.z, b.x, b.y, b.z); }));
  const lineGeometry = new THREE.BufferGeometry(); lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x86a5d8, transparent: true, opacity: .26 });
  network.add(new THREE.LineSegments(lineGeometry, lineMaterial));
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x9ab2e3, transparent: true, opacity: .47 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15, .006, 6, 140), orbitMaterial); ring.rotation.set(1.15, .18, .3); sculpture.add(ring);
  const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(2.42, .004, 6, 140), orbitMaterial); ringTwo.rotation.set(.35, .7, -.65); sculpture.add(ringTwo);
  let shape = 'knot'; let hovered = false;
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  runtime.bind(runtime.renderer.domElement, 'pointermove', event => {
    if (event.buttons) return;
    const rect = runtime.renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, runtime.camera);
    const next = raycaster.intersectObject(core, false).length > 0;
    if (next !== hovered) { hovered = next; material.emissive.setHex(next ? 0x1a2850 : 0x000000); runtime.render(); }
  });
  runtime.bind(runtime.renderer.domElement, 'pointerleave', () => { hovered = false; material.emissive.setHex(0x000000); runtime.render(); });
  function selectShape(value) {
    shape = value; core.geometry = geometries[value];
    globeLines.visible = value === 'globe'; material.flatShading = value === 'crystal'; material.needsUpdate = true;
    panel.querySelectorAll('[data-shape]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.shape === value)));
    status.textContent = `${value === 'knot' ? 'Neural knot' : value === 'globe' ? 'Data globe' : 'Crystal core'} selected. Drag or use arrow keys to rotate.`;
    runtime.render();
  }
  function selectColor(value) {
    material.color.setHex(colors[value]); nodeMaterial.color.setHex(colors[value]);
    panel.querySelectorAll('[data-color]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.color === value)));
    runtime.render();
  }
  panel.querySelectorAll('[data-shape]').forEach(button => runtime.bind(button, 'click', () => selectShape(button.dataset.shape)));
  panel.querySelectorAll('[data-color]').forEach(button => runtime.bind(button, 'click', () => selectColor(button.dataset.color)));
  const spreadInput = document.querySelector('#node-spread');
  runtime.bind(spreadInput, 'input', () => {
    const spread = Number(spreadInput.value) / 100;
    network.scale.setScalar(1 + spread * .36); ring.scale.setScalar(1 + spread * .18); ringTwo.scale.setScalar(1 + spread * .12);
    core.scale.setScalar(1 - spread * .13); lineMaterial.opacity = .26 - spread * .17; runtime.render();
  });
  const wireframeButton = document.querySelector('#wireframe-toggle');
  runtime.bind(wireframeButton, 'click', () => { material.wireframe = !material.wireframe; wireframeButton.setAttribute('aria-pressed', String(material.wireframe)); runtime.render(); });
  runtime.bind(motionButton, 'click', () => runtime.setPaused(!runtime.paused));
  runtime.bind(document.querySelector('#hero-reset'), 'click', () => {
    selectShape('knot'); selectColor('blue'); material.wireframe = false; wireframeButton.setAttribute('aria-pressed', 'false');
    spreadInput.value = '0'; network.scale.setScalar(1); ring.scale.setScalar(1); ringTwo.scale.setScalar(1); core.scale.setScalar(1); lineMaterial.opacity = .26;
    core.rotation.set(.65, -.18, -.5); network.rotation.set(0, 0, 0); sculpture.position.y = 0;
    runtime.reset(); status.textContent = 'Sculpture and camera reset.';
  });
  runtime.onFrame((delta, elapsed) => {
    core.rotation.y += delta * (shape === 'crystal' ? .14 : .09);
    network.rotation.y -= delta * .035;
    sculpture.position.y = Math.sin(elapsed * .6) * .045;
  });
  panel.hidden = false; document.querySelector('.hero-art').classList.add('ready'); runtime.render();
  if (import.meta.hot) import.meta.hot.dispose(() => {
    Object.values(geometries).filter(geometry => geometry !== core.geometry).forEach(geometry => geometry.dispose());
    runtime.dispose();
  });
}
