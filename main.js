(function(){
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close nav on link click (mobile)
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scrolling enhancement with offset for sticky header
  const header = document.querySelector('.site-header');
  const headerHeight = () => header ? header.getBoundingClientRect().height : 0;
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - headerHeight() - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });

  // Lazy-load iframes using IntersectionObserver
  const iframes = Array.from(document.querySelectorAll('iframe[data-src]'));
  const loadIframe = (el) => {
    if (!el || el.src) return;
    const src = el.getAttribute('data-src');
    if (src) {
      el.src = src;
      el.removeAttribute('data-src');
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          loadIframe(entry.target);
          obs.unobserve(entry.target);
        }
      }
    }, { rootMargin: '200px 0px' });
    iframes.forEach(el => io.observe(el));
  } else {
    // Fallback: load all iframes immediately
    iframes.forEach(loadIframe);
  }

  // Current year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

(function(){
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;
  const titleEl = document.getElementById('gallery-title');
  const contentEl = document.getElementById('gallery-content');
  const closeEls = modal.querySelectorAll('[data-close]');

  const galleries = {
    independence: {
      title: 'Independence Day',
      items: [
        { src: 'https://placehold.co/800x600/0b122b/ffffff?text=Independence+1', caption: 'Flag hoisting' },
        { src: 'https://placehold.co/800x600/0b122b/ffffff?text=Independence+2', caption: 'Cultural program' },
        { src: 'https://placehold.co/800x600/0b122b/ffffff?text=Independence+3', caption: 'Patriotic performances' },
        { src: 'https://placehold.co/800x600/0b122b/ffffff?text=Independence+4', caption: 'Students and staff' }
      ]
    },
    freshers: {
      title: 'Freshers',
      items: [
        { href: 'https://www.instagram.com/reel/DOKtGV9k-Xt/?igsh=MWMwM3U5bnRmNjFhYQ==', caption: 'Freshers Reel (Instagram)' }
      ]
    },
    graduation: {
      title: 'Graduation',
      items: [
        { href: 'https://www.instagram.com/reel/DOtIEKNjhSb/?igsh=MWJldmZob283OXd6eQ==', caption: 'Graduation Ceremony (Instagram)' }
      ]
    },
    sanskriti: {
      title: 'Sanskriti Hind ki Pehchan',
      items: [
        { href: 'https://www.instagram.com/p/DO8oQSAjfb4/?igsh=dWFwcDg3cXI4eWx5', caption: 'Sanskriti Hind ki Pehchan (Instagram)' }
      ]
    },
    workshops: {
      title: 'Workshops & Seminars',
      items: [
        { src: 'https://placehold.co/800x600/0b122b/ffffff?text=Workshop+1', caption: 'Hands-on session' },
        { src: 'https://placehold.co/800x600/0b122b/ffffff?text=Seminar+2', caption: 'Guest speaker' },
        { src: 'https://placehold.co/800x600/0b122b/ffffff?text=Workshop+3', caption: 'Team activity' },
        { src: 'https://placehold.co/800x600/0b122b/ffffff?text=Seminar+4', caption: 'Q&A' }
      ]
    }
  };

  const openGallery = (key) => {
    const g = galleries[key];
    if (!g) return;
    if (titleEl) titleEl.textContent = g.title;
    if (contentEl) {
      contentEl.innerHTML = g.items.map(item => {
        if (item.src) {
          return `<figure class="gallery-item"><img src="${item.src}" alt="${item.caption}"><figcaption>${item.caption}</figcaption></figure>`;
        }
        if (item.href) {
          return `<figure class="gallery-item"><a class="gallery-link" href="${item.href}" target="_blank" rel="noopener">Open Instagram</a><figcaption>${item.caption}</figcaption></figure>`;
        }
        return '';
      }).join('');
    }
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (contentEl) contentEl.innerHTML = '';
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.event-btn');
    if (btn) {
      const key = btn.getAttribute('data-gallery');
      if (key) {
        const g = galleries[key];
        if (g && Array.isArray(g.items) && g.items.length === 1 && g.items[0].href) {
          window.open(g.items[0].href, '_blank', 'noopener');
        } else {
          openGallery(key);
        }
      }
      return;
    }
    const closeTarget = e.target.closest('[data-close]');
    if (closeTarget) {
      closeModal();
      return;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
})();

(function(){
  const canvas = document.getElementById('network-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let points = [];
  let raf = 0;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    width = window.innerWidth; height = window.innerHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    init();
  }

  function init(){
    const count = Math.round(Math.min(140, Math.max(60, (width * height) / 12000)));
    points = new Array(count).fill(0).map(() => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const s = 0.2 + Math.random() * 0.6;
      const a = Math.random() * Math.PI * 2;
      const vx = Math.cos(a) * s * (prefersReduced ? 0 : 0.4);
      const vy = Math.sin(a) * s * (prefersReduced ? 0 : 0.4);
      const r = 1 + Math.random() * 1.8;
      return {x,y,vx,vy,r};
    });
  }

  function draw(){
    ctx.clearRect(0,0,width,height);
    const grad1 = ctx.createRadialGradient(width*0.15, height*0.2, 0, width*0.15, height*0.2, Math.max(width,height)*0.8);
    grad1.addColorStop(0,'rgba(34,211,238,0.10)');
    grad1.addColorStop(1,'rgba(0,0,0,0)');
    const grad2 = ctx.createRadialGradient(width*0.85, height*0.1, 0, width*0.85, height*0.1, Math.max(width,height)*0.7);
    grad2.addColorStop(0,'rgba(167,139,250,0.10)');
    grad2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = grad1; ctx.fillRect(0,0,width,height);
    ctx.fillStyle = grad2; ctx.fillRect(0,0,width,height);

    const maxDist = Math.min(180, Math.max(90, Math.hypot(width,height) / 18));
    ctx.lineWidth = 1;
    for (let i=0;i<points.length;i++){
      const p = points[i];
      if (!prefersReduced){
        p.x += p.vx; p.y += p.vy;
        if (p.x < -50) p.x = width + 50; else if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50; else if (p.y > height + 50) p.y = -50;
      }
      for (let j=i+1;j<points.length;j++){
        const q = points[j];
        const dx = p.x - q.x; const dy = p.y - q.y;
        const dist = Math.hypot(dx,dy);
        if (dist < maxDist){
          const t = 1 - dist / maxDist;
          const c1 = 34 + Math.floor(80 * t);
          const c2 = 211; const c3 = 238;
          ctx.strokeStyle = `rgba(${c1},${c2},${c3},${0.15 * t})`;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
        }
      }
    }
    for (let i=0;i<points.length;i++){
      const p = points[i];
      const glow = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,10);
      glow.addColorStop(0,'rgba(164, 243, 252, 0.9)');
      glow.addColorStop(1,'rgba(164, 243, 252, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.x,p.y, Math.max(1,p.r), 0, Math.PI*2); ctx.fill();
    }
  }

  function loop(){
    draw();
    raf = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  if (prefersReduced){
    draw();
  } else {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }
})();
