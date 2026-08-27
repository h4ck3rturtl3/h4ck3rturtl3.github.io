/* HackerTurtles :: Matrix-Regen (shared) */
(function(){
  const c = document.getElementById('matrix');
  if(!c) return;
  const ctx = c.getContext('2d');
  const glyphs = 'アカサタナハマヤラワ0123456789ABCDEF{}[]<>#$%&*/\\|'.split('');
  const fontSize = 16;
  let cols, drops;

  function resize(){
    c.width = window.innerWidth; c.height = window.innerHeight;
    cols = Math.floor(c.width / fontSize);
    drops = new Array(cols).fill(1).map(()=>Math.random()*-100);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw(){
    ctx.fillStyle = 'rgba(3,8,6,0.08)';
    ctx.fillRect(0,0,c.width,c.height);
    ctx.font = fontSize + "px 'Share Tech Mono', monospace";
    for(let i=0;i<drops.length;i++){
      const txt = glyphs[Math.floor(Math.random()*glyphs.length)];
      const x = i*fontSize, y = drops[i]*fontSize;
      ctx.fillStyle = Math.random() > 0.975 ? '#b9ffcf' : '#00ff6a';
      ctx.fillText(txt, x, y);
      if(y > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ draw(); }
  else { setInterval(draw, 55); }
})();
