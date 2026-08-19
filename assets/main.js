(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const year = document.querySelector('[data-year]');

  const setHeaderState = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.querySelector('span').textContent = open ? 'Close' : 'Menu';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.querySelector('span').textContent = 'Menu';
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.querySelector('span').textContent = 'Menu';
        menuButton.focus();
      }
    });
  }

  const volunteerForm = document.querySelector('[data-volunteer-form]');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!volunteerForm.reportValidity()) return;
      const data = new FormData(volunteerForm);
      const helps = data.getAll('help');
      const body = [
        `Name: ${data.get('name') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Phone: ${data.get('phone') || ''}`,
        `Neighbourhood / street: ${data.get('neighbourhood') || ''}`,
        `Interested in: ${helps.length ? helps.join(', ') : 'Not specified'}`,
        '',
        'Message:',
        data.get('message') || ''
      ].join('\n');
      const subject = encodeURIComponent('Volunteer for Jasvir - Ward 2');
      window.location.href = `mailto:info@electjasvir.ca?subject=${subject}&body=${encodeURIComponent(body)}`;
    });
  }

  if (year) year.textContent = new Date().getFullYear();
})();
