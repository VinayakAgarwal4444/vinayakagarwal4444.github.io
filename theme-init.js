// Apply the saved theme before first paint to avoid a flash.
try {
  const t = localStorage.getItem('theme');
  if (t) document.documentElement.dataset.theme = t;
} catch {
  // Storage is blocked: fall back to the system theme.
}
