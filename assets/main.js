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

  // Fast, subtle reveal as content enters the viewport on phones.
  const setupMobileReveals = () => {
    if (!window.matchMedia('(max-width: 680px)').matches) return;

    const selectors = [
      '.meet-copy',
      '.meet-photos figure',
      '.vision-heading',
      '.statement-card',
      '.priorities-heading',
      '.priority-overview article',
      '.issue-row',
      '.principle-row article',
      '.community-photo',
      '.community-copy',
      '.map-copy',
      '.map-frame',
      '.volunteer-heading',
      '.volunteer-options article',
      '.volunteer-form',
      '.volunteer-qr',
      '.connect-inner'
    ];

    const items = [...document.querySelectorAll(selectors.join(','))];
    items.forEach((item, index) => {
      item.classList.add('reveal-on-scroll');
      const siblingIndex = [...(item.parentElement?.children || [])].indexOf(item);
      if (siblingIndex === 1) item.classList.add('reveal-delay-1');
      if (siblingIndex >= 2) item.classList.add('reveal-delay-2');
    });

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -3% 0px' });

    items.forEach((item) => observer.observe(item));
  };

  setupMobileReveals();

  if (year) year.textContent = new Date().getFullYear();
})();
