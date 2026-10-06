import * as THREE from 'three';
import { createSceneRuntime, disposeObject } from './scene-runtime.js';
import { createProjectModel } from './project-models.js';

const shortNames=['Virtual Teacher','Photobooth','AI Agents','Pantry','Rainwater','Classifier'];

export function initProjectScene(projects, openProject) {
  const lab=document.querySelector('#project-lab'), canvasContainer=document.querySelector('#project-scene');
  const motionButton=document.querySelector('#lab-motion'), optionContainer=document.querySelector('#lab-project-options');
  let selected=0, model, hovered=false;
  const baseEmissive=new Map();
  lab.hidden=false;
  const runtime=createSceneRuntime(canvasContainer,{
    position:[4.7,2.4,8.2],
    onPlayback(paused){
      motionButton.setAttribute('aria-pressed',String(paused));
      motionButton.setAttribute('aria-label',paused?'Play project rotation':'Pause project rotation');
      motionButton.textContent=paused?'▷':'Ⅱ';
    },
    onLost(){
      lab.classList.add('lab-webgl-fallback');
      canvasContainer.textContent='The 3D preview is unavailable. Choose a project to explore its story.';
      document.querySelector('.lab-camera-controls').hidden=true;
      document.querySelector('#lab-hint').hidden=true;
    }
  });
  const {scene}=runtime;
  runtime.renderer.toneMappingExposure=1.4;
  scene.add(new THREE.HemisphereLight(0xd6e7ff,0x456483,2.3));
  const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-3,5,4);scene.add(key);
  const rim=new THREE.DirectionalLight(0x83b7ff,2);rim.position.set(4,1,-3);scene.add(rim);
  const stage=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.35,.1,64),new THREE.MeshStandardMaterial({color:0x24375a,roughness:.6,metalness:.35}));stage.position.y=-1.78;scene.add(stage);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(2.18,.012,6,100),new THREE.MeshBasicMaterial({color:0x668dce,transparent:true,opacity:.45}));ring.rotation.x=Math.PI/2;ring.position.y=-1.715;scene.add(ring);
  const floorGrid=new THREE.GridHelper(12,24,0x45638f,0x263c62);floorGrid.position.y=-1.86;floorGrid.material.transparent=true;floorGrid.material.opacity=.25;scene.add(floorGrid);
  optionContainer.innerHTML=projects.map((project,index)=>`<button data-lab-project="${index}" aria-pressed="${index===0}" aria-label="Show 3D model for ${project.title}"><span>${String(index+1).padStart(2,'0')}</span>${shortNames[index]}</button>`).join('');

  function selectProject(index){
    if(model){scene.remove(model);disposeObject(model);}
    selected=index;hovered=false;baseEmissive.clear();
    model=createProjectModel(index);scene.add(model);
    runtime.renderer.domElement.style.cursor='grab';
    optionContainer.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.labProject)===index)));
    document.querySelector('#lab-project-title').textContent=projects[index].title;
    document.querySelector('#lab-project-summary').textContent=projects[index].summary;
    document.querySelector('#lab-model-number').textContent=`MODEL ${String(index+1).padStart(2,'0')} / 06`;
    runtime.renderer.domElement.setAttribute('aria-label',`${projects[index].title} 3D concept model. Arrow keys rotate. Plus and minus zoom. Enter opens project details.`);
    runtime.reset();runtime.render();
  }
  runtime.bind(optionContainer,'click',event=>{const button=event.target.closest('[data-lab-project]');if(button)selectProject(Number(button.dataset.labProject));});
  runtime.bind(document.querySelector('#lab-open-project'),'click',()=>openProject(selected));
  runtime.bind(document.querySelector('#lab-zoom-in'),'click',()=>runtime.zoom(.88));
  runtime.bind(document.querySelector('#lab-zoom-out'),'click',()=>runtime.zoom(1.14));
  runtime.bind(document.querySelector('#lab-reset'),'click',()=>runtime.reset());
  runtime.bind(motionButton,'click',()=>runtime.setPaused(!runtime.paused));

  const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
  const canvas=runtime.renderer.domElement;
  function hit(event){
    const rect=canvas.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,runtime.camera);
    model.updateWorldMatrix(true,true);
    return raycaster.intersectObject(model,true).length>0;
  }
  function highlight(value){
    if(value===hovered)return;
    hovered=value;
    const materials=new Set();
    model.traverse(object=>{if(object.material?.emissive)materials.add(object.material);});
    materials.forEach(material=>{
      if(!baseEmissive.has(material))baseEmissive.set(material,material.emissive.clone());
      material.emissive.copy(baseEmissive.get(material));
      if(value)material.emissive.add(new THREE.Color(0x172b46));
    });
    canvas.style.cursor=value?'pointer':'grab';runtime.render();
  }
  let pointerDown, dragged=false;
  runtime.bind(canvas,'pointerdown',event=>{pointerDown={x:event.clientX,y:event.clientY,id:event.pointerId};dragged=false;});
  runtime.bind(canvas,'pointermove',event=>{
    if(pointerDown&&Math.hypot(event.clientX-pointerDown.x,event.clientY-pointerDown.y)>6)dragged=true;
    if(!event.buttons)highlight(hit(event));
  });
  runtime.bind(canvas,'pointerup',event=>{
    const clicked=pointerDown&&!dragged&&event.pointerId===pointerDown.id;
    pointerDown=null;
    if(clicked&&hit(event))openProject(selected);
  });
  runtime.bind(canvas,'pointercancel',()=>{pointerDown=null;dragged=false;});
  runtime.bind(canvas,'pointerleave',()=>highlight(false));
  runtime.bind(canvas,'keydown',event=>{if(event.key==='Enter'){event.preventDefault();openProject(selected);}});
  runtime.onFrame((delta,time)=>model?.userData.animate?.(delta,time));
  selectProject(0);
  lab.classList.add('lab-ready');
  if(import.meta.hot)import.meta.hot.dispose(()=>runtime.dispose());
}
