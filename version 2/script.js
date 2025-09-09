// ==========================
// SCROLL ANIMATION
// ==========================
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("in-view"); });
}, {threshold:0.3});
sections.forEach(sec=>observer.observe(sec));

// ==========================
// TYPING EFFECT
// ==========================
const typedEl = document.querySelector(".typed");
const text = typedEl.dataset.text;
let index = 0;
function type(){ if(index<text.length){ typedEl.textContent += text.charAt(index); index++; setTimeout(type,100); } }
type();

// ==========================
// STARFIELD / PARTICLES
// ==========================
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [], planets=[], shootingStars=[], mouseParticles=[];
const STAR_COUNT=2000, PLANET_COUNT=5;
function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener('resize',resize); resize();

// Stars
function initStars(){ stars=[]; for(let i=0;i<STAR_COUNT;i++){ stars.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, z:Math.random()*canvas.width, o:Math.random(), size:Math.random()*2 }); } }
initStars();

// Planets
function initPlanets(){ planets=[]; for(let i=0;i<PLANET_COUNT;i++){ planets.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*50+20, angle:Math.random()*Math.PI*2, speed:(Math.random()*0.02)+0.005 }); } }
initPlanets();

document.addEventListener("mousemove",(e)=>{ mouseParticles.push({x:e.clientX, y:e.clientY, r:Math.random()*3+1, alpha:1}); });

// Shooting Stars
function newShootingStar(){ shootingStars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height/2, len: Math.random()*80+20, speed: Math.random()*10+6 }); }
setInterval(newShootingStar,1500);

// Button explosion
document.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("click",e=>{
    for(let i=0;i<100;i++){ mouseParticles.push({x:e.clientX, y:e.clientY, r:Math.random()*5+1, alpha:1}); }
  });
});

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Stars
  stars.forEach(s=>{
    s.z-=2; if(s.z<=0){ s.x=Math.random()*canvas.width; s.y=Math.random()*canvas.height; s.z=canvas.width; s.o=Math.random(); s.size=Math.random()*2; }
    const k=128.0/s.z; const x=(s.x-canvas.width/2)*k+canvas.width/2; const y=(s.y-canvas.height/2)*k+canvas.height/2; const size=s.size*k;
    ctx.beginPath(); ctx.arc(x,y,size,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${s.o})`; ctx.fill();
  });

  // Planets
  planets.forEach(p=>{
    p.angle+=p.speed; const px=p.x+Math.cos(p.angle)*50; const py=p.y+Math.sin(p.angle)*50;
    ctx.beginPath(); ctx.arc(px,py,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,200,100,0.3)`; ctx.fill();
  });

  // Mouse particles
  for(let i=0;i<mouseParticles.length;i++){
    let p=mouseParticles[i]; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${p.alpha})`; ctx.fill(); p.alpha-=0.02;
  }
  mouseParticles=mouseParticles.filter(p=>p.alpha>0);

  // Shooting stars
  for(let i=0;i<shootingStars.length;i++){
    let s=shootingStars[i]; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x+s.len,s.y+s.len/4); ctx.strokeStyle="white"; ctx.stroke(); s.x+=s.speed; s.y+=s.speed/4;
    if(s.x>canvas.width||s.y>canvas.height) shootingStars.splice(i,1);
  }

  requestAnimationFrame(animate);
}
animate();
