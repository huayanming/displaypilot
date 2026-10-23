(function(){
  var pane=document.getElementById('st-pane'), lines=document.getElementById('st-lines');
  var state=document.getElementById('st-state'), evEl=document.getElementById('m-events'), gapEl=document.getElementById('m-gap');
  var maxEl=document.getElementById('m-max'), dropEl=document.getElementById('m-drops'), verdict=document.getElementById('st-verdict');
  var canvas=document.getElementById('st-canvas'), ctx=canvas.getContext('2d');
  if(!pane||!ctx) return;
  for(var i=1;i<=37;i++){var s=document.createElement('span');s.innerHTML='<b>'+(i<10?'0':'')+i+'</b><span>'+(i%4===0?'slow notch':'wheel sample')+'</span>';lines.appendChild(s);}
  var wheel=[], frames=[], raf=0, last=0, running=false, idleTimer=0;
  function now(){return performance.now()}
  function reset(){
    wheel=[]; frames=[]; last=0; running=false; cancelAnimationFrame(raf); raf=0;
    evEl.textContent='0'; gapEl.textContent='—'; dropEl.textContent='0'; maxEl.textContent='—';
    verdict.className='st-verdict'; verdict.textContent='Scroll at least a few notches. The test needs wheel events before it can say anything useful.';
    state.textContent='Waiting for a wheel event'; draw();
  }
  function tick(t){
    if(!running) return;
    if(last){var dt=t-last; if(dt>0&&dt<200) frames.push(dt);} last=t;
    if(frames.length>240) frames.splice(0,frames.length-240);
    draw(); raf=requestAnimationFrame(tick);
  }
  function begin(){
    if(running) return;
    running=true; last=0; frames=[]; state.textContent='Recording…'; raf=requestAnimationFrame(tick);
    clearTimeout(idleTimer); idleTimer=setTimeout(function(){if(running){running=false;cancelAnimationFrame(raf);raf=0;state.textContent='Recording complete';}},1800);
  }
  function stats(){
    if(wheel.length<2) return null;
    var gaps=[]; for(var i=1;i<wheel.length;i++) gaps.push(wheel[i]-wheel[i-1]);
    var avg=gaps.reduce(function(a,b){return a+b},0)/gaps.length;
    var max=Math.max.apply(null,gaps);
    var sorted=frames.slice().sort(function(a,b){return a-b});
    var med=sorted.length?sorted[Math.floor(sorted.length/2)]:16.7;
    var drops=frames.filter(function(f){return f>med*1.5}).length;
    return {n:wheel.length,avg:avg,max:max,drops:drops,bad:max>48||drops>Math.max(2,frames.length*.12)};
  }
  function render(){
    var s=stats(); if(!s){verdict.className='st-verdict';verdict.textContent='Scroll at least a few notches. The test needs wheel events before it can say anything useful.';draw();return;}
    evEl.textContent=String(s.n); gapEl.innerHTML=Math.round(s.avg)+'<small>ms</small>'; maxEl.innerHTML=Math.round(s.max)+'<small>ms</small>'; dropEl.textContent=String(s.drops);
    if(s.n<4){verdict.className='st-verdict';verdict.textContent='Keep scrolling: '+s.n+' events so far. Four or more gives a more useful sample.';}
    else if(s.bad){verdict.className='st-verdict warn';verdict.textContent='This sample has visible wheel gaps or dropped frames. Try another slow notch; if it repeats, the browser or another input utility is reshaping the wheel.';}
    else{verdict.className='st-verdict ok';verdict.textContent='This sample looks smooth: wheel events are evenly spaced and frames are arriving consistently in this browser.';}
    draw();
  }
  function draw(){
    var w=canvas.width,h=canvas.height; ctx.clearRect(0,0,w,h);
    var data=frames.length?frames:[]; if(!data.length) return;
    var max=Math.max.apply(null,data), n=Math.min(data.length,120), start=Math.max(0,data.length-n);
    ctx.strokeStyle='rgba(87,81,74,.35)';ctx.lineWidth=2;ctx.beginPath();
    for(var i=0;i<n;i++){var x=i/(n-1||1)*(w-20)+10;var y=h-8-(data[start+i]/(max||16.7))*(h-16);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.stroke();
  }
  pane.addEventListener('wheel',function(e){
    begin(); wheel.push(now()); if(wheel.length>300) wheel.splice(0,wheel.length-300);
    state.textContent='Recording… '+wheel.length+' wheel events';
    clearTimeout(idleTimer); idleTimer=setTimeout(function(){running=false;cancelAnimationFrame(raf);raf=0;state.textContent='Recording complete';render();},1800);
    render();
  },{passive:true});
  document.getElementById('st-reset').addEventListener('click',reset);
  document.getElementById('st-full').addEventListener('click',function(){ if(pane.requestFullscreen) pane.requestFullscreen().catch(function(){}); else pane.focus(); });
  reset();
})();
