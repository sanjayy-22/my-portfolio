import './style.css';
import './interactive.css';

const handArt = `<div class="teacher-scan"></div><div class="hand-visual"><svg viewBox="0 0 130 170" aria-hidden="true"><path class="hand-outline" d="M36 135 17 103Q12 94 18 91Q23 87 29 95L42 111 38 51Q38 44 43 44Q49 44 50 51L53 84 53 30Q53 23 59 23Q65 23 65 30L67 80 71 39Q71 32 77 32Q83 32 82 41L80 87 86 58Q87 51 93 52Q99 53 96 63L94 102Q95 128 85 137L83 155 46 155Z"/><g class="hand-connections"><path d="m48 139 16-33 15 30M64 106 45 94 43 51m21 55-4-30-1-46m5 76 12-29 1-36m-13 65 27-14 2-32M64 106 25 102 18 94M45 94l15-18 16 1 15 15M48 139l31-3"/></g>${[[48,139],[79,136],[64,106],[45,94],[43,51],[60,76],[59,30],[76,77],[77,41],[91,92],[93,60],[25,102],[18,94]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.8"/>`).join('')}</svg></div><div class="teacher-signal">${'<i></i>'.repeat(5)}</div>`;
const agentArt = `<div class="agent-network"><svg viewBox="0 0 255 185" aria-hidden="true"><line x1="128" y1="92" x2="40" y2="40"/><line x1="128" y1="92" x2="215" y2="40"/><line x1="128" y1="92" x2="40" y2="146"/><line x1="128" y1="92" x2="215" y2="146"/><line x1="40" y1="40" x2="215" y2="40"/><line x1="40" y1="146" x2="215" y2="146"/></svg><span class="agent-node core">✳</span><span class="agent-node n1">⌘</span><span class="agent-node n2">◇</span><span class="agent-node n3">≋</span><span class="agent-node n4">↗</span></div>`;
const shelfArt = `<div class="shelf-visual"><svg viewBox="0 0 200 154" aria-hidden="true"><path d="m25 126 105 14 55-22-106-13Z" fill="#c2d2c3" opacity=".35"/><path d="M35 26h130v112H35Z" fill="#d8e3d7" stroke="#9dad9b"/><path d="m35 26 10-8h130l-10 8Z" fill="#e9eee3" stroke="#a4b3a1"/><path d="m165 26 10-8v112l-10 8Z" fill="#bdccba" stroke="#a4b3a1"/><path d="M40 34h120v40H40Z" fill="#eaf0e5"/><path d="M40 83h120v47H40Z" fill="#eaf0e5"/><path d="M35 75h130v7H35Z" fill="#aeba9f"/><rect x="49" y="47" width="19" height="27" rx="3" fill="#b2c9b1" stroke="#91b090"/><rect x="52" y="44" width="13" height="4" rx="1" fill="#8da38c"/><rect x="75" y="40" width="27" height="34" rx="2" fill="#d6ccae" stroke="#b9ae91"/><path d="M78 51h21m-21 4h21" stroke="#b5ab8d"/><rect x="113" y="52" width="17" height="22" rx="3" fill="#c2cfb4" stroke="#9db18f"/><rect x="116" y="49" width="11" height="4" fill="#9aaa8f"/><rect x="137" y="41" width="16" height="33" rx="3" fill="#c8bcb0" stroke="#b0a293"/><rect x="47" y="107" width="31" height="23" rx="2" fill="#c5cdb1" stroke="#aab595"/><path d="M48 112h29" stroke="#aab595"/><rect x="88" y="92" width="21" height="38" rx="3" fill="#b6c9bd" stroke="#8dab9a"/><rect x="91" y="89" width="15" height="5" fill="#8dab9a"/><rect x="122" y="101" width="30" height="29" rx="2" fill="#d4c3a8" stroke="#baa589"/><path d="m133 101 8 0v12l-4-2-4 2Z" fill="#b29d81"/><path d="M26 65h7m-3-4v8M176 91h7m-3-4v8" stroke="#8fa887"/></svg></div>`;
const rainArt = `<div class="rain-visual"><svg viewBox="0 0 208 170" aria-hidden="true"><path d="m17 130 93 32 87-40-95-28Z" fill="#c8dddf" opacity=".5"/><path d="m38 68 70 23v63l-70-24Z" fill="#d4e6e7" stroke="#9bbcc4"/><path d="m108 91 59-25v62l-59 26Z" fill="#bad3d8" stroke="#9bbcc4"/><path d="m33 65 68-27 72 23-65 29Z" fill="#e6f1f1" stroke="#97b9c2"/><path d="m48 63 54-20 55 18-50 23Z" fill="#cedfe1" stroke="#a5c4ca"/><path d="m49 99 15 5v18l-15-5Zm26 9 15 5v18l-15-5Z" fill="#93b6c8"/><path d="m122 107 14-6v18l-14 6Z" fill="#88adbd"/><path d="m171 73 0 34 12 5v21" fill="none" stroke="#709eaa" stroke-width="4" stroke-linejoin="round"/><ellipse cx="180" cy="133" rx="15" ry="6" fill="#a7c9d0" stroke="#7ca7b4"/><path d="M165 121v12q15 10 30 0v-12" fill="#b7d7dd" stroke="#7ca7b4"/><ellipse cx="180" cy="121" rx="15" ry="6" fill="#d6e9ec" stroke="#7ca7b4"/><path d="m68 20-4 8m37-16-4 8m35 0-4 8m22-6-4 8" stroke="#78a9be" stroke-width="2" stroke-linecap="round"/></svg></div>`;
const projects = [
  { title: 'AI Virtual Teacher', category: 'COMPUTER VISION · ACCESSIBILITY', filters: ['vision'], theme:'teacher', caption:'INTELLIGENCE THAT CONNECTS', art:handArt, summary:'Bridging communication gaps with real-time sign language understanding.', description:'Developed an AI-powered communication system that interprets sign language using computer vision and converts it into speech or text in real time. The system enables two-way interaction by generating sign-language responses through multimodal agents, supporting deaf, mute, and visually impaired users.', tags:['Computer vision','Multimodal agents','Sign language'] },
  { title: 'AI Photobooth', category: 'GENERATIVE AI · CREATIVE TOOLS', filters:['generative','vision'], theme:'photo', caption:'A DIFFERENT KIND OF SELF-PORTRAIT', art:'<div class="photo-glow"></div><div class="portrait portrait-one"></div><div class="portrait portrait-two"></div><span class="photo-star">✧</span><span class="photo-star second">✧</span>', summary:'Custom portraits and dynamic visual effects, powered by generative models.', description:'Created an AI-powered photo booth using image generation and style transfer models to produce customizable portraits and dynamic visual effects, with automated background enhancement.', tags:['Image generation','Style transfer','Background enhancement'] },
  { title: 'Agent Orchestration Framework', category: 'GENERATIVE AI · INTELLIGENT SYSTEMS', filters:['generative'], theme:'agents', caption:'MANY AGENTS. ONE SHARED GOAL.', art:agentArt, summary:'Collaborative AI agents that reason, coordinate, and get work done.', description:'Designed an agent orchestration system enabling collaborative AI task execution. It combines resource optimization, LLM-based reasoning, and decision automation for workflow management.', tags:['LLM reasoning','AI agents','Workflow automation'] },
  { title: 'Kitchen Pantry Organizer', category: 'GENERATIVE AI · EVERYDAY SOLUTIONS', filters:['generative'], theme:'pantry', caption:'A LITTLE ORDER. A LOT OF INTELLIGENCE.', art:shelfArt, summary:'AI-assisted product placement and organization for smarter pantry management.', description:'Implemented an AI-based pantry management solution leveraging generative models, including Gemini and Stable Diffusion, alongside vector databases. The solution aligns client products onto a shelf and synchronizes them with a product database.', tags:['Gemini','Stable Diffusion','Vector databases'] },
  { title: 'Rooftop Rainwater Harvesting Advisor', category: 'COMPUTER VISION · SUSTAINABILITY', filters:['vision','applied'], theme:'rain', caption:'BETTER USE OF EVERY DROP', art:rainArt, summary:'Turning image, satellite, and sensor data into sustainable home solutions.', description:'Developed an AI-assisted system that analyzes user images, satellite data, and sensor data to recommend optimal rainwater harvesting setups for urban households. It displays a 3D model of the completed solution so users can visualize the recommendation.', tags:['Image analysis','Sensor data','3D visualization'] },
  { title: 'AI Intent Classifier', category: 'APPLIED ML · CUSTOMER EXPERIENCE', filters:['applied'], theme:'classifier', caption:'FROM QUESTIONS TO CLARITY', art:`<div class="ticket-stack">${['ACCOUNT','BOOKING','SUPPORT'].map(x=>`<div class="ticket"><span class="ticket-icon"></span><span class="ticket-lines"><i></i><i></i></span><span class="ticket-tag">${x}</span></div>`).join('')}</div><span class="classifier-spark">✧</span>`, summary:'Fine-tuning machine learning to understand and classify customer queries.', description:'Fine-tuned an ML model to classify query tickets shared by customers of Ridewinners during an ML research internship at Logic Prime.', tags:['Machine learning','Fine-tuning','Intent classification'] }
];

const renderArt = (project,index) => `<div class="project-art art-${project.theme}" aria-hidden="true"><span class="art-index">EXPERIMENT / ${String(index+1).padStart(2,'0')}</span><span class="art-corner">+</span>${project.art}<span class="art-caption">${project.caption}</span></div>`;
const renderTags = project => `<div class="tags">${project.tags.map(tag=>`<span>${tag}</span>`).join('')}</div>`;
const grid = document.querySelector('#project-grid');
grid.innerHTML = projects.map((project,index)=>`<article class="project-card" data-categories="${project.filters.join(' ')}"><button class="project-open" data-project="${index}" aria-label="Read about ${project.title}">${renderArt(project,index)}<div class="project-category">${project.category}</div><div class="project-title-row"><h3>${project.title}</h3><span class="card-arrow" aria-hidden="true">↗</span></div><p class="project-summary">${project.summary}</p></button>${renderTags(project)}</article>`).join('');

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
  let count=0;
  grid.querySelectorAll('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&!card.dataset.categories.split(' ').includes(button.dataset.filter);if(!card.hidden)count++;});
  document.querySelector('#filter-status').textContent=`Showing ${count} projects.`;
}));

const dialog=document.querySelector('#project-dialog');
function openProject(index){
  const project=projects[index];
  if(!project)return;
  document.querySelector('#dialog-content').innerHTML=`<div class="dialog-art">${renderArt(project,index)}</div><p class="dialog-kicker">${project.category}</p><h2 id="dialog-title" class="dialog-title">${project.title}</h2><p class="dialog-description">${project.description}</p>${renderTags(project)}<p class="dialog-footnote">Curious about the project? <a class="text-link" href="mailto:sanjai462004@gmail.com?subject=${encodeURIComponent(`Let's talk about ${project.title}`)}">Let’s talk ↗</a></p>`;
  dialog.showModal();document.body.style.overflow='hidden';
  document.dispatchEvent(new CustomEvent('portfolio:modal',{detail:true}));
}
grid.addEventListener('click',event=>{
  const button=event.target.closest('[data-project]');
  if(button)openProject(Number(button.dataset.project));
});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();});
dialog.addEventListener('close',()=>{document.body.style.overflow='';document.dispatchEvent(new CustomEvent('portfolio:modal',{detail:false}));});

const menuToggle=document.querySelector('.menu-toggle');const mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';mobileNav.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});

let copyReset;
document.querySelector('#copy-email').addEventListener('click',async()=>{
  const button=document.querySelector('#copy-email');
  try{await navigator.clipboard.writeText('sanjai462004@gmail.com');button.textContent='Copied ✓';document.querySelector('#copy-status').textContent='Email address copied to clipboard.';clearTimeout(copyReset);copyReset=setTimeout(()=>{button.innerHTML='Copy email <span aria-hidden="true">⧉</span>';},2500);}
  catch{document.querySelector('#copy-status').textContent='Please copy the email address: sanjai462004@gmail.com';button.textContent='Select email';const range=document.createRange();range.selectNodeContents(document.querySelector('.contact-email'));window.getSelection().removeAllRanges();window.getSelection().addRange(range);}
});

if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.about-layout,.section-heading,.experience-layout,.skills-grid,.education').forEach(element=>{element.classList.add('reveal');revealObserver.observe(element);});
}

import('./scene.js').then(({initScene})=>initScene()).catch(()=>{
  const motionButton=document.querySelector('#motion-toggle');motionButton.hidden=true;
  document.querySelector('.art-interact').textContent='Ideas, interconnected.';
});

import('./project-scene.js').then(({initProjectScene})=>initProjectScene(projects,openProject)).catch(()=>{
  document.querySelector('#project-lab').hidden=true;
});
