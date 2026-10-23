(function(){
  var pattern=document.getElementById('pattern'),caption=document.getElementById('caption'),stage=document.getElementById('stage');
  var tabs=[].slice.call(document.querySelectorAll('.dt-tab'));
  function build(kind){
    var h='';
    if(kind==='ramp'){h='<div class="dt-ramp">';for(var i=0;i<21;i++){var v=Math.round(i*255/20);h+='<span class="dt-ramp-'+i+'"></span>';}h+='</div>';caption.textContent='灰阶渐变: every step should be visible on a calibrated display.';}
    else if(kind==='bars'){var c=['#ff0000','#00ff00','#0000ff','#00ffff','#ff00ff','#ffff00','#ffffff','#000000'];h='<div class="dt-bars">';c.forEach(function(x,i){h+='<span class="dt-bar-'+i+'"></span>';});h+='</div>';caption.textContent='彩条: check for a colour cast and for clean transitions.';}
    else if(kind==='black'){h='<div class="dt-steps">';for(var i=0;i<9;i++){var v=i;h+='<span class="dt-black-'+v+'">'+v+'</span>';}h+='</div>';caption.textContent='近黑: count how many dark steps you can distinguish from the black background.';}
    else if(kind==='white'){h='<div class="dt-steps">';for(var j=0;j<9;j++){var w=247+j;h+='<span class="dt-white-'+j+'">'+w+'</span>';}h+='</div>';caption.textContent='近白: check that the brightest steps do not clip into one flat white.';}
    else if(kind==='sharp'){h='<div class="dt-grid"><i></i></div>';caption.textContent='1 像素网格: use the display native resolution and avoid browser zoom. The grid should not smear or moiré.';}
    else {h='<div class="dt-uniform"></div>';caption.textContent='均匀场: look for uneven brightness or colour across the panel.';}
    pattern.innerHTML=h;
  }
  tabs.forEach(function(t){t.addEventListener('click',function(){tabs.forEach(function(x){x.setAttribute('aria-selected','false')});t.setAttribute('aria-selected','true');build(t.dataset.kind);});});
  document.getElementById('full').addEventListener('click',function(){if(stage.requestFullscreen)stage.requestFullscreen().catch(function(){});});
  build('ramp');
})();
