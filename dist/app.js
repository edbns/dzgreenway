'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = motionPreference.matches;
  document.documentElement.classList.toggle('js-motion', !reduced);
  document.body.classList.toggle('motion-reduced', reduced);
  $('#year').textContent = new Date().getFullYear();
  const revealObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {e.target.classList.add('visible');revealObserver.unobserve(e.target);}
  }), {threshold: .09});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  let seed = 15237;
  const random = () => {seed = (seed * 16807) % 2147483647;return (seed - 1) / 2147483646;};
  const clamp = (x,a=0,b=1) => Math.min(b,Math.max(a,x));
  const mix = (a,b,t) => a+(b-a)*t;
  const smooth = x => {x=clamp(x);return x*x*(3-2*x);};
  const TAU = Math.PI*2;
  const profile = [
    [-1.74,.29],[-1.71,.48],[-1.64,.59],[-1.55,.63],[-1.44,.63],
    [-1.35,.60],[-1.28,.63],[-1.19,.63],[-1.12,.59],[-1.04,.63],
    [-.95,.63],[-.88,.59],[-.80,.63],[-.71,.63],[-.64,.59],
    [-.56,.63],[-.47,.63],[-.40,.59],[-.32,.63],[-.18,.63],
    [0,.63],[.18,.63],[.30,.63],[.36,.60],[.43,.63],[.51,.63],
    [.57,.60],[.64,.62],[.73,.61],[.83,.58],[.94,.52],[1.05,.44],
    [1.16,.35],[1.23,.27],[1.30,.24],[1.37,.24],[1.40,.28],
    [1.46,.28],[1.49,.245],[1.53,.27],[1.65,.27],[1.69,.25]
  ];
  const segments = 36;
  const mesh = [];
  for (let r=0;r<profile.length-1;r++) {
    for(let j=0;j<segments;j++){
      const a=j/segments*TAU,b=(j+1)/segments*TAU;
      const [y0,rad0]=profile[r], [y1,rad1]=profile[r+1];
      const vertex=(y,rad,ang)=>[Math.cos(ang)*rad,y,Math.sin(ang)*rad];
      mesh.push({v:[vertex(y0,rad0,a),vertex(y0,rad0,b),vertex(y1,rad1,b),vertex(y1,rad1,a)],
        angle:(a+b)/2, cap:r>=38, index:mesh.length, flake:[(random()-.5)*4.7,(random()-.5)*3.4,(random()-.5)*3.2],
        spin:random()*TAU, size:.016+random()*.035, depth:random(), drift:random()*TAU});
    }
  }
  let logoPoints=[];
  const logo=new Image();
  logo.src='assets/green-way-transparent.png';
  let dirty=true;
  logo.onload=()=>{
    const sample=document.createElement('canvas');sample.width=180;sample.height=180;
    const ctx=sample.getContext('2d',{willReadFrequently:true});ctx.drawImage(logo,0,0,180,180);
    const data=ctx.getImageData(0,0,180,180).data;
    for(let y=0;y<180;y+=2)for(let x=0;x<180;x+=2){const k=(y*180+x)*4;if(data[k+3]>100&&data[k+1]>90)logoPoints.push([(x-90)/25,(90-y)/25,0]);}
    dirty=true;
  };
  const stages=[
    {kicker:'THE STARTING POINT',title:'A bottle’s story<br>can keep going.',description:'PET plastic has possibilities beyond its first use. Recycling gives the material a chance to begin again.',label:'01 / USED PET'},
    {kicker:'THE TRANSFORMATION',title:'Smaller pieces.<br>New possibilities.',description:'Sorting, washing and processing can turn used PET into recycled flakes — a material ready for its next chapter.',label:'02 / RECYCLED FLAKES'},
    {kicker:'THE DIRECTION',title:'A greener way<br>to move forward.',description:'This is the idea behind SARL DZ GREEN WAY: building a new PET recycling factory in Algeria with tomorrow in mind.',label:'03 / A NEW BEGINNING'}
  ];
  let target=0,progress=0,stage=-1,auto=!reduced,loopTime=0,cycleTime=0;
  const slider=$('#transformation');
  const play=$('#motion-toggle');
  function updatePlay(){
    play.querySelector('.motion-label').textContent=auto?'PAUSE':'PLAY';
    play.querySelector('.pause-icon').textContent=auto?'Ⅱ':'▷';
    play.setAttribute('aria-label',auto?'Pause animation':'Play animation');
    play.disabled=reduced;
  }
  function updateStage(p){
    const next=p<.25?0:p<.75?1:2;
    if(next===stage)return;
    stage=next;const copy=stages[stage];
    $('#stage-kicker').textContent=copy.kicker;
    $('#stage-title').innerHTML=copy.title;
    $('#stage-description').textContent=copy.description;
    $('#live-state').textContent=copy.label;
    document.querySelectorAll('.step').forEach((el,i)=>{el.classList.toggle('active',i===stage);el.setAttribute('aria-pressed',String(i===stage));});
  }
  function setProgress(value){auto=false;target=value;if(reduced)progress=value;updatePlay();updateStage(value);dirty=true;}
  document.querySelectorAll('.step').forEach(el=>el.addEventListener('click',()=>setProgress(Number(el.dataset.stage)/2)));
  slider.addEventListener('input',()=>setProgress(Number(slider.value)/1000));
  play.addEventListener('click',()=>{
    auto=!auto;
    if(auto){loopTime=target<.25?0:target<.75?5.5:11;}
    updatePlay();dirty=true;
  });
  const motionButton=$('#global-motion');
  function setReduced(value){
    reduced=value;document.body.classList.toggle('motion-reduced',reduced);
    document.documentElement.classList.toggle('js-motion',!reduced);
    motionButton.setAttribute('aria-pressed',String(reduced));
    motionButton.innerHTML=reduced?'ENABLE MOTION <span>◉</span>':'REDUCE MOTION <span>◉</span>';
    if(reduced){auto=false;progress=target;}
    updatePlay();dirty=true;
  }
  motionButton.addEventListener('click',()=>setReduced(!reduced));
  motionPreference.addEventListener('change',e=>setReduced(e.matches));
  setReduced(reduced);updateStage(0);

  function makeSurface(id,hero){
    const canvas=$(id),ctx=canvas.getContext('2d',{alpha:true});
    const s={canvas,ctx,hero,w:0,h:0,dpr:1,visible:true};
    new ResizeObserver(entries=>{const rect=entries[0].contentRect;s.w=rect.width;s.h=rect.height;s.dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(s.w*s.dpr);canvas.height=Math.round(s.h*s.dpr);dirty=true;}).observe(canvas);
    new IntersectionObserver(entries=>{s.visible=entries[0].isIntersecting;dirty=true;},{rootMargin:'80px'}).observe(canvas);
    return s;
  }
  const hero=makeSurface('#hero-canvas',true),cycle=makeSurface('#cycle-canvas',false);
  let pointer={x:0,y:0};
  $('.hero').addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const rect=hero.canvas.getBoundingClientRect();pointer.x=(e.clientX-rect.left)/rect.width-.5;pointer.y=(e.clientY-rect.top)/rect.height-.5;});
  $('.hero').addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0;});
  let pointerSmooth={x:0,y:0};
  function rotate(v,angle,tilt){
    const ca=Math.cos(angle),sa=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt);
    let x=v[0]*ca+v[2]*sa,z=-v[0]*sa+v[2]*ca;
    return [x*ct-v[1]*st,x*st+v[1]*ct,z];
  }
  function render(s,t,p){
    if(!s.visible||s.w<1||s.h<1)return;
    const {ctx,w,h,dpr}=s;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const mobile=w<500;
    const scale=Math.min(w*(s.hero?.34:.24),h*(s.hero?.235:.213))*(1-.25*Math.sin(p*Math.PI));
    const cx=w*(s.hero?.54:.5),cy=h*(s.hero?.51:.5);
    const angle=s.hero?.45+Math.sin(t*.24)*.4+pointerSmooth.x*.3:.45+Math.sin(t*.18)*.3;
    const tilt=s.hero?-.19+pointerSmooth.y*.05:-.12;
    const disassemble=smooth(p*2);
    const assemble=smooth((p-.5)*2);
    const projection=v=>{const perspective=5.7/(5.7-v[2]);return [cx+v[0]*scale*perspective,cy-v[1]*scale*perspective,perspective];};
    // A soft grounding shadow keeps the material dimensional without raster assets.
    const shadow=ctx.createRadialGradient(cx,cy+scale*1.95,0,cx,cy+scale*1.95,scale*.95);
    shadow.addColorStop(0,'rgba(17,255,30,.12)');shadow.addColorStop(1,'rgba(17,255,30,0)');
    ctx.save();ctx.translate(0,(cy+scale*1.95)*.78);ctx.scale(1,.22);ctx.fillStyle=shadow;ctx.fillRect(cx-scale*1.2,cy+scale*.75,scale*2.4,scale*2.4);ctx.restore();
    if(p<.51){
      const polygons=mesh.map(m=>{
        const center=m.v.reduce((a,v)=>[a[0]+v[0]/4,a[1]+v[1]/4,a[2]+v[2]/4],[0,0,0]);
        const verts=m.v.map(v=>{
          const flutter=disassemble*Math.sin(t*.5+m.drift)*.1;
          const n=[mix(v[0],m.flake[0]+(v[0]-center[0])*.5,disassemble),mix(v[1],m.flake[1]+(v[1]-center[1])*.5,disassemble)+flutter,mix(v[2],m.flake[2],disassemble)];
          return rotate(n,angle,tilt);
        });
        const depth=verts.reduce((sum,v)=>sum+v[2]/4,0);
        return {m,verts,depth};
      }).sort((a,b)=>a.depth-b.depth);
      polygons.forEach(({m,verts,depth})=>{
        const points=verts.map(projection);
        const face=Math.sin(m.angle-angle);
        const spec=Math.pow(Math.max(0,Math.cos(m.angle-angle-1.05)),16);
        const visibility=.15+.85*clamp((depth+1)/2);
        ctx.beginPath();points.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();
        const cap=m.cap;
        const r=cap?20:Math.round(22+spec*112),g=cap?200:Math.round(98+spec*150),b=cap?22:Math.round(34+spec*93);
        ctx.fillStyle=`rgba(${r},${g},${b},${cap?.54:.045+spec*.30+visibility*.035})`;
        ctx.fill();
        ctx.strokeStyle=`rgba(${Math.round(17+spec*135)},255,${Math.round(30+spec*130)},${cap?.4:.055+visibility*.075+spec*.25})`;
        ctx.lineWidth=cap?.65:.5;ctx.stroke();
      });
    } else {
      // Individual polygon flakes converge on sampled pixels of the actual supplied logo.
      const particles=mesh.map((m,i)=>{
        const lp=logoPoints.length?logoPoints[Math.floor(i/mesh.length*logoPoints.length)]:[0,0,0];
        const flutter=(1-assemble)*.08;
        const v=[mix(m.flake[0],lp[0],assemble),mix(m.flake[1]+Math.sin(t*.6+m.drift)*flutter,lp[1],assemble),mix(m.flake[2],0,assemble)];
        const rot=rotate(v,angle*(1-assemble),tilt*(1-assemble));
        return {m,v:rot};
      }).sort((a,b)=>a.v[2]-b.v[2]);
      const fade=1-smooth((p-.92)/.08);
      for(const {m,v} of particles){
        const q=projection(v);const size=m.size*scale*q[2]*(1-assemble*.6);
        ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(m.spin+t*.12*(1-assemble));
        ctx.beginPath();ctx.moveTo(-size,-size*.4);ctx.lineTo(size*.9,-size*.65);ctx.lineTo(size*.55,size*.7);ctx.lineTo(-size*.7,size*.4);ctx.closePath();
        const alpha=(.16+m.depth*.62)*fade;ctx.fillStyle=`rgba(${Math.round(17+m.depth*65)},255,${Math.round(30+m.depth*53)},${alpha})`;ctx.fill();
        ctx.strokeStyle=`rgba(150,255,140,${alpha*.6})`;ctx.lineWidth=.45;ctx.stroke();ctx.restore();
      }
      if(logo.complete&&logo.naturalWidth&&p>.9){
        ctx.save();ctx.globalAlpha=smooth((p-.9)/.1);
        const size=scale*7.2;ctx.drawImage(logo,cx-size/2,cy-size/2,size,size);ctx.restore();
      }
    }
    // Sparse fragments orbit the hero bottle, hinting at its next life.
    if(s.hero){
      for(let i=0;i<19;i++){
        const m=mesh[i*53];const a=i*2.399+t*.065;
        const v=rotate([Math.cos(a)*(1.05+(i%3)*.23),Math.sin(i*3.7)*1.95,Math.sin(a)*.8],.2,-.14);
        const q=projection(v),size=(2+i%3)*q[2];
        ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(a);ctx.beginPath();ctx.moveTo(-size,0);ctx.lineTo(size,-size*.65);ctx.lineTo(size*.3,size);ctx.closePath();ctx.fillStyle=`rgba(17,255,30,${.18+(i%4)*.12})`;ctx.fill();ctx.restore();
      }
    }
  }
  let last=0,heroTime=0,pageVisible=true;
  document.addEventListener('visibilitychange',()=>{pageVisible=!document.hidden;last=0;dirty=true;});
  function frame(timestamp){
    requestAnimationFrame(frame);
    if(!pageVisible)return;
    const dt=last?Math.min((timestamp-last)/1000,.05):0;last=timestamp;
    if(reduced&&!dirty)return;
    if(!reduced){heroTime+=dt;if(auto&&cycle.visible){loopTime+=dt;cycleTime+=dt;const phase=loopTime%18;
      if(phase<3.5)target=0;
      else if(phase<6)target=smooth((phase-3.5)/2.5)*.5;
      else if(phase<9)target=.5;
      else if(phase<12)target=.5+smooth((phase-9)/3)*.5;
      else if(phase<16)target=1;
      else target=1-smooth((phase-16)/2);
    }
      pointerSmooth.x=mix(pointerSmooth.x,pointer.x,.025);pointerSmooth.y=mix(pointerSmooth.y,pointer.y,.025);
      progress=mix(progress,target,1-Math.exp(-dt*5));
    }
    if(Math.abs(progress-target)<.001)progress=target;
    render(hero,reduced?0:heroTime,0);
    render(cycle,reduced?0:cycleTime,progress);
    slider.value=String(Math.round(progress*1000));updateStage(progress);dirty=false;
  }
  requestAnimationFrame(frame);
})();
