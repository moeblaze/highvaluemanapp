
/* MCC Background Rotator — with diagnostics + fallback */
(function bgRotator(){
  const FALLBACKS = [
    "linear-gradient(135deg, #111, #222)",
    "linear-gradient(135deg, #222, #111)"
  ];
  const MCC_BG_ROTATOR_IMAGES = (window.MCC_BG_ROTATOR_IMAGES || [
    "assets/img/bg_sports_1.webp",
    "assets/img/bg_sports_2.webp",
    "assets/img/bg_cars_mansion.png",
    "assets/img/bg_penthouse.png"
  ]);
  if(!Array.isArray(MCC_BG_ROTATOR_IMAGES) || MCC_BG_ROTATOR_IMAGES.length < 1){
    console.warn("MCC Rotator: No images defined, using fallbacks.");
    MCC_BG_ROTATOR_IMAGES.push(...FALLBACKS);
  }
  const layer = document.createElement("div");
  layer.id = "bg-rotator";
  layer.innerHTML = '<div class="slide s0 visible"></div><div class="slide s1"></div>';
  document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(layer); });
  const slides = layer.querySelectorAll(".slide");
  let i = 0;
  // Preload with error logging
  MCC_BG_ROTATOR_IMAGES.forEach(src => {
    if(src.startsWith("linear-gradient")){
      return; // skip gradients
    }
    const im = new Image();
    im.onload = ()=>console.log("MCC Rotator loaded:", src);
    im.onerror = ()=>console.error("MCC Rotator missing image:", src);
    im.src = src;
  });
  // Initialize first two
  function setBg(slide, src){
    if(src.startsWith("linear-gradient")){
      slide.style.backgroundImage = src;
    } else {
      slide.style.backgroundImage = "url('"+src+"')";
    }
  }
  setBg(slides[0], MCC_BG_ROTATOR_IMAGES[0] || FALLBACKS[0]);
  setBg(slides[1], MCC_BG_ROTATOR_IMAGES[1] || FALLBACKS[1]);
  function swap(){
    const next = (i + 1) % MCC_BG_ROTATOR_IMAGES.length;
    const visible = layer.querySelector(".slide.visible");
    const hidden  = (visible === slides[0]) ? slides[1] : slides[0];
    setBg(hidden, MCC_BG_ROTATOR_IMAGES[next]);
    requestAnimationFrame(()=>{ hidden.classList.add("visible"); visible.classList.remove("visible"); i = next; });
  }
  setInterval(swap, 30000);
})();
