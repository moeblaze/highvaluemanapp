
const bgImages = [
  'static/img/hv1.png',
  'static/img/hv2.png',
  'static/img/hv3.png',
  'static/img/hv4.png'
];
let bgIndex = 0;
let bgEl;
window.addEventListener('load', () => {
  bgEl = document.querySelector('.millionaire-bg');
  bgImages.forEach(src => { const i = new Image(); i.src = src; });
  if (bgEl) {
    bgEl.style.backgroundImage = `url('${bgImages[0]}')`;
    setInterval(rotateBackground, 60000);
  }
});
function rotateBackground() {
  if (!bgEl) return;
  bgIndex = (bgIndex + 1) % bgImages.length;
  bgEl.classList.add('fade-out');
  setTimeout(() => {
    bgEl.style.backgroundImage = `url('${bgImages[bgIndex]}')`;
    bgEl.classList.remove('fade-out');
  }, 800);
}
