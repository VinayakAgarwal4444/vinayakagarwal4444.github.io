document.getElementById('year').textContent = new Date().getFullYear();

var root = document.documentElement;
document.getElementById('theme-toggle').addEventListener('click', function () {
  var dark =
    root.dataset.theme === 'dark' ||
    (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  var next = dark ? 'light' : 'dark';
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
});

// Project showcase: a spotlight that follows the cursor and a gentle 3D tilt
// on the screenshot frame. Mouse only, and off for reduced-motion users.
if (matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-spotlight]').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - r.left + 'px');
      card.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });
  document.querySelectorAll('[data-tilt]').forEach(function (frame) {
    frame.addEventListener('pointermove', function (e) {
      var r = frame.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.setProperty('--ry', (x * 6).toFixed(2) + 'deg');
      frame.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
    });
    frame.addEventListener('pointerleave', function () {
      frame.style.setProperty('--rx', '0deg');
      frame.style.setProperty('--ry', '0deg');
    });
  });
}
