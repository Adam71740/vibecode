// ==========================
// SCROLL ANIMATION
// ==========================
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("in-view");
  });
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
let stars = [];
const STAR_COUNT = 1000; // Thousands of stars
function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

function initStars(){
  stars = [];
  for(let i=0;i<STAR_COUNT;i++){
    stars.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      z:Math.random()*canvas.width,
      o:Math.random(),
      size:Math.random()*2
    });
  }
}
initStars();

function moveStars(){
  for(let i=0;i<STAR_COUNT;i++){
    stars[i].z -= 2;
    if(stars[i].z<=0){ stars[i].x=Math.random()*canvas.width; stars[i].y=Math.random()*canvas.height; stars[i].z=canvas.width; stars[i].o=Math.random(); stars[i].size=Math.random()*2;}
  }
}

function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<STAR_COUNT;i++){
    const k = 128.0/stars[i].z;
    const x = (stars[i].x - canvas.width/2)*k + canvas.width/2;
    const y = (stars[i].y - canvas.height/2)*k + canvas.height/2;
    const size = stars[i].size*k;
    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${stars[i].o})`;
    ctx.fill();
  }
}

function animateStars(){
  moveStars();
  drawStars();
  requestAnimationFrame(animateStars);
}
animateStars();

// ==========================
// MOUSE TRAIL PARTICLES
// ==========================
let particles = [];
document.addEventListener("mousemove",(e)=>{
  particles.push({x:e.clientX, y:e.clientY, r:Math.random()*3+1, alpha:1});
});

function drawParticles(){
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${p.alpha})`;
    ctx.fill();
    p.alpha -= 0.02;
  }
  particles = particles.filter(p=>p.alpha>0);
}

// ==========================
// SHOOTING STARS
// ==========================
let shootingStars=[];
function newShootingStar(){
  shootingStars.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height/2,
    len: Math.random()*80+20,
    speed: Math.random()*10+6
  });
}
setInterval(newShootingStar,2000);

function drawShootingStars(){
  for(let i=0;i<shootingStars.length;i++){
    let s = shootingStars[i];
    ctx.beginPath();
    ctx.moveTo(s.x,s.y);
    ctx.lineTo(s.x+s.len,s.y+s.len/4);
    ctx.strokeStyle="white";
    ctx.stroke();
    s.x += s.speed;
    s.y += s.speed/4;
    if(s.x>canvas.width || s.y>canvas.height) shootingStars.splice(i,1);
  }
}

// ==========================
// MAIN ANIMATION LOOP
// ==========================
function loop(){
  animateStars();
  drawParticles();
  drawShootingStars();
  requestAnimationFrame(loop);
}
loop();

// ==========================
// BUTTON CLICK EXPLOSION
// ==========================
document.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("click",e=>{
    for(let i=0;i<50;i++){
      particles.push({x:e.clientX, y:e.clientY, r:Math.random()*5+1, alpha:1});
    }
  });
});
