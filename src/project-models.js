import * as THREE from 'three';

function material(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: .33, metalness: .15, ...extra });
}
function mesh(group, geometry, surface, x = 0, y = 0, z = 0) {
  const object = new THREE.Mesh(geometry, surface);
  object.position.set(x, y, z); group.add(object); return object;
}
function box(group, surface, size, position = [0, 0, 0]) {
  return mesh(group, new THREE.BoxGeometry(...size), surface, ...position);
}
function sphere(group, surface, radius, position = [0, 0, 0]) {
  return mesh(group, new THREE.SphereGeometry(radius, 20, 14), surface, ...position);
}
function link(group, surface, from, to, radius = .026) {
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
  const object = mesh(group, new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 8), surface);
  object.position.copy(a).add(b).multiplyScalar(.5);
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
  return object;
}

function virtualTeacher() {
  const root = new THREE.Group();
  const palmMaterial = material(0x79a9f3), jointMaterial = material(0xd1edff, { emissive: 0x3967ac, emissiveIntensity: .5 });
  const palm = sphere(root, palmMaterial, .8, [0, -.4, 0]); palm.scale.set(1, 1.15, .38);
  const bones = [];
  [-.55, -.2, .17, .5].forEach((x, i) => {
    const height = [1.15, 1.5, 1.35, .95][i];
    mesh(root, new THREE.CapsuleGeometry(.125, height, 6, 12), palmMaterial, x, height / 2 + .28, 0);
    bones.push([x, .3, .29], [x, height / 2 + .35, .17], [x, height + .28, .06]);
  });
  const thumb = mesh(root, new THREE.CapsuleGeometry(.16, .68, 6, 12), palmMaterial, -.93, -.15, 0); thumb.rotation.z = -.65;
  bones.push([-.72, -.42, .19], [-1.17, .14, .05]);
  bones.forEach(position => sphere(root, jointMaterial, .055, position));
  bones.forEach((position, i) => { if (i % 3 !== 2 && bones[i + 1]) link(root, jointMaterial, position, bones[i + 1], .012); });
  sphere(root, jointMaterial, .075, [0, -.6, .32]);
  [-.55, -.2, .17, .5].forEach(x => link(root, jointMaterial, [0, -.6, .32], [x, .3, .29], .012));
  const speech = new THREE.Group(); root.add(speech); speech.position.set(1.3, .6, .05);
  box(speech, material(0x283f68), [.65, .5, .18]);
  const bars = [];
  for (let i = 0; i < 5; i++) bars.push(box(speech, jointMaterial, [.035, .1 + (.2 - Math.abs(i - 2) * .07), .025], [-.2 + i * .1, 0, .105]));
  root.userData.animate = (_, time) => bars.forEach((bar, i) => { bar.scale.y = .6 + Math.sin(time * 2 + i) * .35; });
  return root;
}

function photobooth() {
  const root = new THREE.Group();
  const colors = [0xa2b6fa, 0xdca9da, 0x91cfc6];
  const frames = [];
  colors.forEach((color, i) => {
    const frame = new THREE.Group(); root.add(frame);
    frame.position.set((i - 1) * 1.04, i === 1 ? .12 : -.08, i === 1 ? .38 : 0);
    frame.rotation.z = (i - 1) * -.13; frame.rotation.y = (i - 1) * -.2;
    const border = material(0xe7edff), background = material(color);
    box(frame, background, [.91, 1.43, .08]);
    box(frame, border, [1.05, .09, .18], [0, .76, .02]);
    box(frame, border, [1.05, .18, .18], [0, -.74, .02]);
    box(frame, border, [.08, 1.48, .18], [-.5, 0, .02]);
    box(frame, border, [.08, 1.48, .18], [.5, 0, .02]);
    const head = sphere(frame, material(0xefc6b7), .21, [0, .17, .11]); head.scale.y = 1.2;
    const hair = sphere(frame, material(0x3e527f), .22, [0, .27, .065]); hair.scale.set(1, 1, .5);
    const torso = sphere(frame, material(i === 1 ? 0xa773b5 : 0x547ac3), .41, [0, -.4, .07]); torso.scale.set(1, 1, .4);
    frames.push(frame);
  });
  const sparkle = mesh(root, new THREE.OctahedronGeometry(.17), material(0xf2d897, { emissive: 0x967025, emissiveIntensity: .3 }), 1.8, 1, .2);
  root.userData.animate = (_, time) => { frames.forEach((frame, i) => { frame.position.y = (i === 1 ? .12 : -.08) + Math.sin(time + i) * .055; }); sparkle.rotation.y = time * .7; };
  return root;
}

function agentNetwork() {
  const root = new THREE.Group();
  const coreMaterial = material(0x648cff, { emissive: 0x254baf, emissiveIntensity: .45 });
  const nodeMaterial = material(0xbdcdf1), lineMaterial = material(0x718fbf);
  const core = mesh(root, new THREE.IcosahedronGeometry(.6, 1), coreMaterial);
  const points = [[-1.25,.8,.2],[1.2,.85,-.25],[-1.15,-.75,.25],[1.2,-.7,.35],[0,.2,-1.45]];
  const signals = [];
  points.forEach((position, i) => {
    const node = box(root, nodeMaterial, [.4,.4,.4], position); node.rotation.set(.2, .35, .15);
    link(root, lineMaterial, [0,0,0], position);
    const signal = sphere(root, material(i % 2 ? 0x89dcc7 : 0xb6a0ff, { emissive: i % 2 ? 0x357c6b : 0x6650a0, emissiveIntensity: .7 }), .065);
    signals.push({ signal, position: new THREE.Vector3(...position), offset: i / 5 });
  });
  points.forEach((point,i) => link(root,lineMaterial,point,points[(i+1)%points.length],.012));
  const ring = mesh(root, new THREE.TorusGeometry(.83,.012,6,80), material(0x91b7ff)); ring.rotation.x = Math.PI / 2;
  root.userData.animate = (delta, time) => { core.rotation.y += delta * .25; signals.forEach(({signal, position, offset}) => { signal.position.copy(position).multiplyScalar((time*.35+offset)%1); }); };
  return root;
}

function pantry() {
  const root = new THREE.Group();
  const wood = material(0xc7d7c2), back = material(0x718d88), bottle = material(0xa6cbb9), peach = material(0xe2b998), cream = material(0xe4d9b3);
  box(root, back, [2.8,2.6,.08],[0,0,-.4]);
  [-1.44,1.44].forEach(x=>box(root,wood,[.14,2.85,1],[x,0,0]));
  [-1.35,-.48,.43,1.35].forEach(y=>box(root,wood,[2.9,.12,1],[0,y,0]));
  const surfaces=[bottle,peach,cream];
  for(let row=0;row<3;row++)for(let i=0;i<4;i++){
    const x=-1.05+i*.7,y=-1.27+row*.9;
    if((row+i)%2===0){
      mesh(root,new THREE.CylinderGeometry(.18,.18,.48,20),surfaces[(row+i)%3],x,y+.24,.05);
      mesh(root,new THREE.CylinderGeometry(.19,.19,.07,20),wood,x,y+.52,.05);
      box(root,cream,[.22,.14,.015],[x,y+.27,.233]);
    }else{
      box(root,surfaces[(row+i)%3],[.4,.59,.35],[x,y+.3,.03]);
      box(root,wood,[.41,.06,.36],[x,y+.61,.03]);
      box(root,cream,[.22,.025,.018],[x,y+.35,.215]);
    }
  }
  return root;
}

function rainwater() {
  const root = new THREE.Group();
  const wall=material(0xc1dee6), roof=material(0x7199b0), window=material(0x3f6892), water=material(0x74d0ed,{emissive:0x164c6f,emissiveIntensity:.3}), pipe=material(0xadd4d7);
  box(root,wall,[2.3,1.7,1.85],[0,-.3,0]);
  box(root,roof,[2.55,.14,2.1],[0,.62,0]);
  box(root,pipe,[2.55,.1,.08],[0,.74,1.02]);
  [-.62,.62].forEach(x=>box(root,window,[.42,.52,.06],[x,-.25,.96]));
  box(root,roof,[.47,.93,.065],[.25,-.67,.965]);
  box(root,window,[.065,.5,.48],[1.18,-.22,0]);
  mesh(root,new THREE.CylinderGeometry(.39,.39,.85,28),pipe,1.75,-.7,.5);
  mesh(root,new THREE.CylinderGeometry(.4,.4,.08,28),water,1.75,-.23,.5);
  link(root,pipe,[1.16,.72,1.02],[1.45,.72,1.02],.05);
  link(root,pipe,[1.45,.72,1.02],[1.45,-.15,1.02],.05);
  link(root,pipe,[1.45,-.15,1.02],[1.75,-.15,.5],.05);
  box(root,material(0x91bfae),[3.8,.1,2.7],[.35,-1.2,.05]);
  const drops=[];
  for(let i=0;i<9;i++){
    const drop=sphere(root,water,.035,[-1.1+(i%3)*.8,1.2,Math.floor(i/3)*.7-.7]);drop.scale.y=2.3;drops.push(drop);
  }
  root.userData.animate=(_,time)=>drops.forEach((drop,i)=>{drop.position.y=1.9-((time*.7+i/9)%1)*1.05;});
  return root;
}

function classifier() {
  const root = new THREE.Group();
  const cardMaterial=material(0xdde6ff), lineMaterial=material(0x9eb4da);
  const surfaces=[material(0x95d6bc),material(0xeac68c),material(0xb9a1e9)];
  const cards=[];
  for(let i=0;i<3;i++){
    const card=new THREE.Group();root.add(card);card.position.set((i-1)*.12,(i-1)*.72,0);card.rotation.z=(i-1)*-.05;
    box(card,cardMaterial,[2.5,.52,.12]);
    box(card,lineMaterial,[.23,.23,.04],[-.97,0,.085]);
    box(card,lineMaterial,[.65,.025,.025],[-.38,.08,.08]);
    box(card,lineMaterial,[.43,.025,.025],[-.49,-.05,.08]);
    box(card,surfaces[i],[.65,.24,.05],[.77,0,.1]);
    const checkMaterial=material(0x55796f);
    link(card,checkMaterial,[.57,0,.14],[.63,-.05,.14],.013);
    link(card,checkMaterial,[.63,-.05,.14],[.74,.06,.14],.013);
    cards.push(card);
  }
  const chip=mesh(root,new THREE.IcosahedronGeometry(.26,0),material(0x8ca6ef,{emissive:0x354d88,emissiveIntensity:.4}),1.68,.5,.05);
  cards.forEach(card=>link(root,lineMaterial,[1.68,.5,.05],[1.28,card.position.y,.05],.012));
  root.userData.animate=(delta,time)=>{chip.rotation.y+=delta*.5;cards.forEach((card,i)=>{card.position.z=Math.sin(time*.8+i)*.09;});};
  return root;
}

const factories=[virtualTeacher,photobooth,agentNetwork,pantry,rainwater,classifier];
export function createProjectModel(index) {
  const model=factories[index]();
  const bounds=new THREE.Box3().setFromObject(model);
  const center=bounds.getCenter(new THREE.Vector3()), size=bounds.getSize(new THREE.Vector3());
  model.position.sub(center);
  const wrapper=new THREE.Group();wrapper.add(model);
  wrapper.scale.setScalar(3.05/Math.max(size.x,size.y,size.z));
  wrapper.userData.animate=model.userData.animate;
  return wrapper;
}
