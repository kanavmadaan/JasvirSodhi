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

  // Fast, subtle reveal as content enters the viewport on all screen sizes.
  const setupScrollReveals = () => {

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
      '.connect-inner', '.journey-hero-copy', '.journey-hero-photo', '.journey-copy', '.journey-quote', '.journey-heading', '.education-card', '.service-work', '.leadership-card', '.belief-inner', '.future-priorities', '.journey-cta-inner', '.vote-hero-copy', '.vote-status-card', '.vote-section-heading', '.vote-step', '.vote-action-band', '.poll-card', '.help-copy', '.help-note', '.vote-official-inner'
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

  setupScrollReveals();


  // 2026 voting popup. Uses Halton Hills local election timestamps (EDT, UTC-04:00).
  const setupVotingPopup = () => {
    if (document.querySelector('[data-vote-popup]')) return;

    const now = new Date();
    const onlineStart = new Date('2026-10-09T09:00:00-04:00');
    const onlineEnd = new Date('2026-10-24T23:59:00-04:00');
    const electionStart = new Date('2026-10-26T10:00:00-04:00');
    const electionEnd = new Date('2026-10-26T20:00:00-04:00');

    // Show during the active online period and again on Election Day.
    // Before 9 a.m. Oct 9, show a same-day opening notice so the campaign can deploy in advance.
    const openingMorning = now >= new Date('2026-10-09T00:00:00-04:00') && now < onlineStart;
    const onlineOpen = now >= onlineStart && now <= onlineEnd;
    const electionDayOpen = now >= electionStart && now <= electionEnd;
    if (!openingMorning && !onlineOpen && !electionDayOpen) return;

    if (sessionStorage.getItem('jasvirVotePopupDismissed') === '1') return;

    let eyebrow = 'ONLINE VOTING IS OPEN';
    let title = 'Voting is now open.';
    let copy = 'Cast your ballot online during the advance voting period, or see your Ward 2 in-person voting options for Election Day.';
    let primaryText = 'Vote Online';
    let primaryHref = 'https://vote2026.haltonhills.ca';

    if (openingMorning) {
      eyebrow = 'ONLINE VOTING OPENS TODAY';
      title = 'Voting opens at 9:00 a.m.';
      copy = 'Online advance voting begins today. You can review the voting options now and return to the official portal once voting opens.';
      primaryText = 'Voting Details';
      primaryHref = 'voting.html';
    } else if (electionDayOpen) {
      eyebrow = 'ELECTION DAY · WARD 2';
      title = 'Polls are open today.';
      copy = 'Vote in person today from 10:00 a.m. to 8:00 p.m. at a Ward 2 voting location.';
      primaryText = 'Find My Voting Location';
      primaryHref = 'voting.html#in-person';
    }

    const overlay = document.createElement('div');
    overlay.className = 'vote-popup-overlay';
    overlay.dataset.votePopup = '';
    overlay.innerHTML = `
      <section class="vote-popup" role="dialog" aria-modal="true" aria-labelledby="vote-popup-title" aria-describedby="vote-popup-copy">
        <button class="vote-popup-close" type="button" aria-label="Close voting announcement" data-vote-popup-close>×</button>
        <div class="vote-popup-badge">${eyebrow}</div>
        <h2 id="vote-popup-title">${title}</h2>
        <p id="vote-popup-copy">${copy}</p>
        <div class="vote-popup-date" aria-label="Important voting dates">
          <div><span>ONLINE</span><strong>Oct 9, 9:00 a.m.<br>to Oct 24, 11:59 p.m.</strong></div>
          <div><span>IN PERSON</span><strong>Oct 26<br>10:00 a.m. – 8:00 p.m.</strong></div>
        </div>
        <div class="vote-popup-actions">
          <a class="button button-primary" href="${primaryHref}" ${primaryHref.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${primaryText}</a>
          <a class="button button-secondary" href="voting.html">All Voting Information</a>
        </div>
        <p class="vote-popup-foot">Official election details are provided by the Town of Halton Hills. Please confirm current information before voting.</p>
      </section>`;

    document.body.appendChild(overlay);
    document.body.classList.add('vote-popup-open');
    const close = overlay.querySelector('[data-vote-popup-close]');
    const dialog = overlay.querySelector('.vote-popup');
    const closePopup = () => {
      overlay.classList.remove('is-open');
      document.body.classList.remove('vote-popup-open');
      sessionStorage.setItem('jasvirVotePopupDismissed', '1');
      window.setTimeout(() => overlay.remove(), 220);
    };

    close.addEventListener('click', closePopup);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closePopup(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && overlay.isConnected) closePopup(); }, { once: true });
    overlay.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      sessionStorage.setItem('jasvirVotePopupDismissed', '1');
      document.body.classList.remove('vote-popup-open');
    }));

    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      close.focus({ preventScroll: true });
    });
  };

  setupVotingPopup();

  if (year) year.textContent = new Date().getFullYear();
})();
