
(function(){
  const key = 'hvm_cookie_agree';
  try { if (localStorage.getItem(key) === 'true') return; } catch(e){}
  const bar = document.createElement('div');
  bar.style.position='fixed'; bar.style.bottom='0'; bar.style.left='0'; bar.style.right='0';
  bar.style.background='rgba(0,0,0,0.9)'; bar.style.color='#fff'; bar.style.padding='12px';
  bar.style.display='flex'; bar.style.justifyContent='space-between'; bar.style.alignItems='center';
  bar.style.zIndex='9999'; bar.innerHTML = '<span>We use cookies to improve your experience.</span>';
  const btn = document.createElement('button');
  btn.textContent='OK'; btn.style.background='gold'; btn.style.border='none'; btn.style.borderRadius='6px';
  btn.style.padding='8px 12px'; btn.style.marginLeft='12px'; btn.style.cursor='pointer';
  btn.onclick = () => { try { localStorage.setItem(key, 'true'); } catch(e){} document.body.removeChild(bar); };
  bar.appendChild(btn);
  document.body.appendChild(bar);
})();
