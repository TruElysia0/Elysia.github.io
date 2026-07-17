(function () {
  const data = window.BLOG_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (str = "") => str.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function fillSiteInfo() {
    $$('[data-site-name]').forEach(el => el.textContent = data.site.name);
    $$('[data-owner]').forEach(el => el.textContent = data.site.owner);
    $('[data-hero-eyebrow]').textContent = data.site.eyebrow;
    $('[data-description]').textContent = data.site.description;
    $('[data-status]').textContent = data.site.status;
    $('[data-location]').textContent = data.site.location;
    $('[data-about]').textContent = data.site.about;
    $('[data-avatar]').textContent = data.site.avatarText;
    $('[data-github-link]').href = data.site.github;
    document.title = `${data.site.name} · ${data.site.owner}`;
    $('#skill-list').innerHTML = data.site.skills.map(x => `<span>${escapeHtml(x)}</span>`).join('');
    $('#social-links').innerHTML = data.site.socials.map(x => `<a href="${x.url}" target="_blank" rel="noreferrer"><b>${x.icon}</b>${escapeHtml(x.name)}</a>`).join('');
  }

  const formatDate = date => new Intl.DateTimeFormat('zh-CN', { year:'numeric', month:'short', day:'numeric' }).format(new Date(date));

  function postCard(post) {
    return `<article class="post-card reveal" data-category="${post.category}">
      <button class="card-link" data-post="${post.id}" aria-label="阅读《${escapeHtml(post.title)}》"></button>
      <div class="post-visual ${post.accent}"><span>${post.emoji}</span><i></i></div>
      <div class="post-card-body">
        <div class="post-meta"><span>${formatDate(post.date)}</span><span>${post.readTime}</span></div>
        <h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.excerpt)}</p>
        <div class="tag-row">${post.tags.map(t => `<span># ${escapeHtml(t)}</span>`).join('')}</div>
      </div>
    </article>`;
  }

  function renderPosts(filter = '全部', query = '') {
    const normalized = query.trim().toLowerCase();
    const filtered = data.posts.filter(p => (filter === '全部' || p.category === filter) &&
      [p.title, p.excerpt, p.category, ...p.tags].join(' ').toLowerCase().includes(normalized));
    const featured = filtered.find(p => p.featured) || filtered[0];
    $('#featured-post').innerHTML = featured ? `<button class="featured-link" data-post="${featured.id}">
      <span class="featured-label">FEATURED · ${featured.category}</span>
      <span class="featured-emoji">${featured.emoji}</span>
      <span class="featured-copy"><small>${formatDate(featured.date)} · ${featured.readTime}</small><strong>${escapeHtml(featured.title)}</strong><em>${escapeHtml(featured.excerpt)}</em><b>阅读全文 →</b></span>
    </button>` : '';
    const rest = featured ? filtered.filter(p => p.id !== featured.id) : [];
    $('#post-grid').innerHTML = rest.map(postCard).join('');
    $('#empty-posts').hidden = filtered.length !== 0;
    bindPostButtons();
    observeReveals();
  }

  function renderFilters() {
    $('#post-filters').innerHTML = data.categories.map((c, i) => `<button class="filter-button ${i === 0 ? 'active' : ''}" data-filter="${c}">${c}</button>`).join('');
    $$('.filter-button').forEach(btn => btn.addEventListener('click', () => {
      $$('.filter-button').forEach(x => x.classList.remove('active')); btn.classList.add('active');
      renderPosts(btn.dataset.filter, $('#post-search').value);
    }));
    $('#post-search').addEventListener('input', e => renderPosts($('.filter-button.active').dataset.filter, e.target.value));
  }

  function renderCollections() {
    $('#project-grid').innerHTML = data.projects.map((p, i) => `<a class="project-card reveal ${p.color}" href="${p.url}" ${p.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''}>
      <span class="project-number">0${i + 1}</span><div class="project-icon">${p.icon}</div><small>${p.type}</small><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.description)}</p><b>查看项目 ↗</b>
    </a>`).join('');
    $('#timeline-list').innerHTML = data.timeline.map(x => `<div class="timeline-item reveal"><time>${x.date}</time><div><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.text)}</p></div></div>`).join('');
    $('#friend-grid').innerHTML = data.friends.map(f => `<a class="friend-card reveal" href="${f.url}" ${f.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''}><span>${f.avatar}</span><div><h3>${escapeHtml(f.name)}</h3><p>${escapeHtml(f.description)}</p></div><b>↗</b></a>`).join('');
  }

  function markdown(md) {
    const lines = escapeHtml(md).split('\n'); let html = '', inList = false, ordered = false;
    const inline = s => s.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    lines.forEach(line => {
      if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
        const isOrdered = /^\d+\. /.test(line);
        if (!inList || ordered !== isOrdered) { if (inList) html += ordered ? '</ol>' : '</ul>'; ordered = isOrdered; html += ordered ? '<ol>' : '<ul>'; inList = true; }
        html += `<li>${inline(line.replace(/^([-*]|\d+\.) /, ''))}</li>`; return;
      }
      if (inList) { html += ordered ? '</ol>' : '</ul>'; inList = false; }
      if (line.startsWith('# ')) html += `<h1>${inline(line.slice(2))}</h1>`;
      else if (line.startsWith('## ')) html += `<h2>${inline(line.slice(3))}</h2>`;
      else if (line.startsWith('### ')) html += `<h3>${inline(line.slice(4))}</h3>`;
      else if (line.startsWith('&gt; ')) html += `<blockquote>${inline(line.slice(5))}</blockquote>`;
      else if (line.trim()) html += `<p>${inline(line)}</p>`;
    });
    if (inList) html += ordered ? '</ol>' : '</ul>';
    return html;
  }

  function openPost(id, updateHash = true) {
    const post = data.posts.find(p => p.id === id); if (!post) return;
    $('#post-content').innerHTML = `<header><span class="featured-label">${post.category}</span><h1>${escapeHtml(post.title)}</h1><p>${formatDate(post.date)} · ${post.readTime}</p><div class="tag-row">${post.tags.map(t => `<span># ${escapeHtml(t)}</span>`).join('')}</div></header><div class="article-body">${markdown(post.content)}</div>`;
    const dialog = $('#post-dialog'); dialog.showModal(); document.body.classList.add('modal-open');
    if (updateHash) history.pushState(null, '', `#post/${post.id}`);
  }

  function closePost() {
    $('#post-dialog').close(); document.body.classList.remove('modal-open');
    if (location.hash.startsWith('#post/')) history.pushState(null, '', '#posts');
  }

  function bindPostButtons() { $$('[data-post]').forEach(btn => btn.addEventListener('click', () => openPost(btn.dataset.post))); }
  let observer;
  function observeReveals() {
    if (!observer) observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }), { threshold: .12 });
    $$('.reveal:not(.visible)').forEach(el => observer.observe(el));
  }

  function createPetals() {
    $('.petals').innerHTML = Array.from({length: 16}, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${6 + (i % 6)}s;--delay:${-(i * .7)}s;--size:${5 + (i % 4)}px"></i>`).join('');
  }

  function setupUI() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') document.documentElement.dataset.theme = 'light';
    $('.theme-toggle').textContent = savedTheme === 'light' ? '☀' : '☾';
    $('.theme-toggle').addEventListener('click', () => {
      const light = document.documentElement.dataset.theme !== 'light';
      document.documentElement.dataset.theme = light ? 'light' : 'dark'; localStorage.setItem('theme', light ? 'light' : 'dark'); $('.theme-toggle').textContent = light ? '☀' : '☾';
    });
    $('.nav-toggle').addEventListener('click', e => { const open = $('.nav-links').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', open); });
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => $('.nav-links').classList.remove('open')));
    $('.dialog-close').addEventListener('click', closePost);
    $('#post-dialog').addEventListener('click', e => { if (e.target === e.currentTarget) closePost(); });
    $('.back-top').addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));
    document.addEventListener('mousemove', e => { const glow = $('.cursor-glow'); glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; });
    window.addEventListener('scroll', () => $('.site-header').classList.toggle('scrolled', scrollY > 30));
    window.addEventListener('hashchange', () => { if (location.hash.startsWith('#post/')) openPost(location.hash.split('/')[1], false); });
  }

  fillSiteInfo(); renderFilters(); renderPosts(); renderCollections(); createPetals(); setupUI(); observeReveals();
  $('#year').textContent = new Date().getFullYear();
  if (location.hash.startsWith('#post/')) setTimeout(() => openPost(location.hash.split('/')[1], false), 0);
})();
