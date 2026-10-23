(function(){
 var layouts=[
 ['Left half',{left:0,top:0,width:'50%',height:'100%'}],
 ['Right half',{left:'50%',top:0,width:'50%',height:'100%'}],
 ['Top half',{left:0,top:0,width:'100%',height:'50%'}],
 ['Bottom half',{left:0,top:'50%',width:'100%',height:'50%'}],
 ['Top left',{left:0,top:0,width:'50%',height:'50%'}],
 ['Top right',{left:'50%',top:0,width:'50%',height:'50%'}],
 ['Bottom left',{left:0,top:'50%',width:'50%',height:'50%'}],
 ['Bottom right',{left:'50%',top:'50%',width:'50%',height:'50%'}],
 ['Left third',{left:0,top:0,width:'33.333%',height:'100%'}],
 ['Center third',{left:'33.333%',top:0,width:'33.334%',height:'100%'}],
 ['Right third',{left:'66.666%',top:0,width:'33.334%',height:'100%'}],
 ['Two-thirds left',{left:0,top:0,width:'66.666%',height:'100%'}]
 ];
 var list=document.getElementById('list'),win=document.getElementById('win'),caption=document.getElementById('caption');
 layouts.forEach(function(item,idx){var b=document.createElement('button');b.className='wl-btn';b.type='button';b.textContent=item[0];b.setAttribute('aria-pressed',idx===0?'true':'false');b.addEventListener('click',function(){apply(item,idx);});list.appendChild(b);});
 function apply(item,idx){var r=item[1];win.style.left=typeof r.left==='number'?r.left+'px':r.left;win.style.top=typeof r.top==='number'?r.top+'px':r.top;win.style.width=r.width;win.style.height=r.height;caption.textContent=item[0];win.textContent=item[0];[].forEach.call(list.children,function(b,i){b.setAttribute('aria-pressed',i===idx?'true':'false');});}
 apply(layouts[0],0);
})();
