document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.ul');
  const navLinks = document.querySelectorAll('.links');

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
});

// Hire page: send the message to a form service, with WhatsApp as a backup
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('hire-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const say = (msg, ok) => { status.textContent = msg; status.className = 'form-status ' + (ok ? 'ok' : 'err'); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const endpoint = form.dataset.endpoint; // paste your Formspree URL into data-endpoint in hire.html
    const d = Object.fromEntries(new FormData(form));
    if (d._gotcha) return;
    const btn = form.querySelector('button[type="submit"]');
    const text = `Hello, I'm ${d.name}. I need: ${d.service}. ${d.message} (Reply to: ${d.email}${d.phone ? ', ' + d.phone : ''})`;
    if (!endpoint) {
      window.open('https://wa.me/233545854976?text=' + encodeURIComponent(text), '_blank');
      say('Opening WhatsApp so you can send your message.', true);
      return;
    }
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) });
      if (!r.ok) throw new Error('failed');
      form.reset();
      say('Thank you! Your message was sent. I will reply as soon as I can.', true);
    } catch (err) {
      say('The form could not deliver your message, so I am opening WhatsApp with it filled in. Just press send there.', false);
      window.open('https://wa.me/233545854976?text=' + encodeURIComponent(text), '_blank');
    }
    btn.disabled = false; btn.textContent = 'Send message';
  });
});

// Home page: scroll reveal and active menu highlight
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('top')) return;
  document.documentElement.classList.add('js');
  const secs = document.querySelectorAll('.home-sec');
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); } });
  }, { threshold: 0.06 });
  secs.forEach((s) => reveal.observe(s));
  const links = document.querySelectorAll('.links');
  const setActive = (id) => links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('#top, .home-sec').forEach((s) => spy.observe(s));
  setActive('top');
});

// Blog: read articles in a dialog
document.addEventListener('DOMContentLoaded', () => {
  const dlg = document.getElementById('post-dialog');
  if (!dlg) return;
  const out = document.getElementById('post-content');
  document.querySelectorAll('.b-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const post = btn.closest('.b-post');
      out.innerHTML = '<h2>' + post.querySelector('h2').textContent + '</h2><p class="b-meta">' +
        post.querySelector('.b-meta').textContent + '</p>' + document.getElementById(btn.dataset.post).innerHTML;
      dlg.scrollTop = 0;
      dlg.showModal();
    });
  });
  dlg.querySelector('.b-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
});
