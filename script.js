const after=document.querySelector('#afterScene'), divider=document.querySelector('#divider'), compare=document.querySelector('#compare');
let dragging=false;
function setCompare(clientX){const r=compare.getBoundingClientRect();let p=Math.max(4,Math.min(96,(clientX-r.left)/r.width*100));after.style.clipPath='inset(0 0 0 '+p+'%)';divider.style.left=p+'%'}
divider.addEventListener('pointerdown',e=>{dragging=true;divider.setPointerCapture(e.pointerId)});
divider.addEventListener('pointermove',e=>{if(dragging)setCompare(e.clientX)});
divider.addEventListener('pointerup',()=>dragging=false);
compare.addEventListener('click',e=>setCompare(e.clientX));
document.querySelectorAll('.service').forEach(el=>{el.addEventListener('mouseenter',()=>{document.querySelectorAll('.service').forEach(x=>x.classList.remove('active'));el.classList.add('active');document.querySelector('#serviceWord').textContent=el.dataset.word})});
document.querySelectorAll('.choices button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.choices button').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected')}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('seen')}),{threshold:.15});document.querySelectorAll('.steps article').forEach(x=>observer.observe(x));