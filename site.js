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
