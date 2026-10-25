// Contact form: sends the message to the contact Worker (see data-endpoint),
// protected by Cloudflare Turnstile. Everything but the message is optional.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var endpoint = form.dataset.endpoint;
  var sitekey = form.dataset.sitekey;
  var status = document.getElementById('cf-status');
  var button = form.querySelector('button[type="submit"]');
  var message = form.elements.message;
  var count = document.getElementById('cf-count');
  var widgetId = null;

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'form-status full' + (kind ? ' ' + kind : '');
  }

  // Not configured yet: keep the page usable and point people at LinkedIn.
  if (!endpoint || !sitekey || sitekey.indexOf('YOUR_') === 0) {
    form.hidden = true;
    var lead = document.getElementById('connect-lead');
    if (lead) lead.textContent = lead.dataset.fallback;
    var alt = document.querySelector('.alt-label');
    if (alt) alt.hidden = true;
    return;
  }

  message.addEventListener('input', function () {
    count.textContent = message.value.length + ' / 5000';
  });

  // Load Turnstile only when the form is on the page.
  window.onContactTurnstile = function () {
    widgetId = window.turnstile.render('#cf-turnstile', {
      sitekey: sitekey,
      action: 'contact',
      theme: 'auto',
    });
  };
  var s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onContactTurnstile';
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;

    if (!f.message.value.trim()) {
      setStatus('Please write a message.', 'error');
      f.message.focus();
      return;
    }
    if (f.email.value && !f.email.checkValidity()) {
      setStatus('That email address doesn’t look right.', 'error');
      f.email.focus();
      return;
    }
    var token = window.turnstile && widgetId !== null ? window.turnstile.getResponse(widgetId) : '';
    if (!token) {
      setStatus('Please complete the human check above the button.', 'error');
      return;
    }

    button.disabled = true;
    setStatus('Sending…');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: f.name.value,
        email: f.email.value,
        website: f.website.value,
        social: f.social.value,
        message: f.message.value,
        company: f.company.value,
        token: token,
      }),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          if (!res.ok || !body.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
        });
      })
      .then(function () {
        form.reset();
        count.textContent = '0 / 5000';
        setStatus('Thanks! Your message is on its way to my inbox.', 'success');
      })
      .catch(function (err) {
        var text = err instanceof TypeError ? 'Couldn’t reach the server. Please try again later.' : err.message;
        setStatus(text, 'error');
      })
      .finally(function () {
        button.disabled = false;
        // Each Turnstile token works once; get a fresh one for the next send.
        if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
      });
  });
})();
