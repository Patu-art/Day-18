const menuButton=document.querySelector("#menuButton");
const mainNav=document.querySelector("#mainNav");
const revealItems=document.querySelectorAll("[data-reveal]");
const studyTabs=document.querySelectorAll(".study-tab");
const studyImage=document.querySelector("#studyImage");
const studyLabel=document.querySelector("#studyLabel");
const studyTitle=document.querySelector("#studyTitle");
const studyCopy=document.querySelector("#studyCopy");
const projectOptions=document.querySelectorAll(".project-options button");
const parallaxVisual=document.querySelector("[data-parallax]");

const studies={
  garden:{
    image:"./assets/garden-study-wide.svg",
    alt:"Concept garden study",
    label:"Concept 01 / Garden",
    title:"Structure first.<br>Planting second.",
    copy:"Strong paths, usable zones and planting that softens the geometry. The point is not decoration — it is a garden that reads clearly."
  },
  driveway:{
    image:"./assets/driveway-study.svg",
    alt:"Concept driveway study",
    label:"Concept 02 / Driveway",
    title:"Make arrival<br>part of the house.",
    copy:"Driveway, planting and entrance are treated as one composition so the front of the property feels considered rather than purely functional."
  }
};

function closeMenu(){
  mainNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded","false");
  menuButton.setAttribute("aria-label","Open navigation");
}

function toggleMenu(){
  const isOpen=mainNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded",String(isOpen));
  menuButton.setAttribute("aria-label",isOpen?"Close navigation":"Open navigation");
}

function activateStudy(tab){
  const study=studies[tab.dataset.study];
  if(!study)return;

  studyTabs.forEach(item=>{
    const current=item===tab;
    item.classList.toggle("is-active",current);
    item.setAttribute("aria-selected",String(current));
  });

  studyImage.classList.add("is-changing");
  window.setTimeout(()=>{
    studyImage.src=study.image;
    studyImage.alt=study.alt;
    studyLabel.textContent=study.label;
    studyTitle.innerHTML=study.title;
    studyCopy.textContent=study.copy;
    studyImage.classList.remove("is-changing");
  },180);
}

function selectProjectOption(button){
  projectOptions.forEach(item=>item.classList.remove("is-selected"));
  button.classList.add("is-selected");
}

menuButton.addEventListener("click",toggleMenu);
mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
studyTabs.forEach(tab=>tab.addEventListener("click",()=>activateStudy(tab)));
projectOptions.forEach(button=>button.addEventListener("click",()=>selectProjectOption(button)));

if("IntersectionObserver" in window){
  const observer=new IntersectionObserver((entries,instance)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add("is-visible");
      instance.unobserve(entry.target);
    });
  },{threshold:.14});
  revealItems.forEach(item=>observer.observe(item));
}else{
  revealItems.forEach(item=>item.classList.add("is-visible"));
}

if(parallaxVisual&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  let pending=false;
  function updateParallax(){
    parallaxVisual.style.transform=`translateY(${Math.min(window.scrollY*.035,22)}px)`;
    pending=false;
  }
  window.addEventListener("scroll",()=>{
    if(pending)return;
    pending=true;
    window.requestAnimationFrame(updateParallax);
  },{passive:true});
}