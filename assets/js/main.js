/* ==========================================================================
   Quadern personal d'anàlisi — JS del lloc
   Un únic fitxer per a totes les pàgines. Cada bloc comprova que els
   elements que necessita existeixin abans d'executar-se, així es pot
   carregar a qualsevol pàgina (portada, post, etc.) sense generar errors.
   ========================================================================== */

/* ---------- Frase aleatòria del peu de pàgina ---------- */
(function () {
  var quoteEl = document.getElementById('footer-quote');
  if (!quoteEl) return;

  // Per afegir, treure o editar frases, només cal tocar aquesta llista.
  var quotes = [
    "El 90% és neteja de dades. Això és l'altre 10%. Fet amb ♥ a Barcelona",
    "Correlació no implica causalitat, però fa bonic al gràfic. Fet amb ♥ a Barcelona",
    "Cada model és fals, pero alguns fan mandra de refer. Fet amb ♥ a Barcelona",
    "Buscant un p-valor per cada dubte existencial. Fet amb ♥ a Barcelona",
    "Aquí no hi ha soroll, només senyal... a vegades. Fet amb ♥ a Barcelona",
    "95% de confiança que això funcionarà. Fet amb ♥ a Barcelona",
    "Aquí les hipòtesis es rebutgen, els cafès no. Fet amb ♥ a Barcelona",
    "N=1, però amb molta convicció. Fet amb ♥ a Barcelona",
    "Backtesting de decisions passades: resultats mixtos. Fet amb ♥ a Barcelona",
    "Overfitting a la vida, underfitting a la son. Fet amb ♥ a Barcelona",
    "Excel abandonat per amor a R. Fet amb ♥ a Barcelona",
    "p < 0.05 i altres excuses per seguir endavant. Fet amb ♥ a Barcelona",
    "Construït a base de cafè, R² i massa pestanyes obertes. Fet amb ♥ a Barcelona",
    "Dades netes, cafè brut. Fet amb ♥ a Barcelona",
    "Si el gràfic no talla a zero, ja és un bon dia. Fet amb ♥ a Barcelona",
    "Notes d'algú a qui li agraden les dades tant com les excuses. Fet amb ♥ a Barcelona",
    "Un outlier més a la col·lecció. Fet amb ♥ a Barcelona",
    "Aquest quadern no té intervals de confiança sobre res. Fet amb ♥ a Barcelona",
    "Vaig demanar significància i em van donar soroll. Fet amb ♥ a Barcelona",
    "R² baix, esforç alt. Fet amb ♥ a Barcelona",
    "Aquí tot és reproduïble, menys jo els dilluns. Fet amb ♥ a Barcelona",
    "Multicolinealitat entre feina i son. Fet amb ♥ a Barcelona",
    "Un dashboard més, una decisió menys. Fet amb ♥ a Barcelona",
    "Testejant hipòtesis i paciència a parts iguals. Fet amb ♥ a Barcelona",
    "Massa variables, poques respostes. Fet amb ♥ a Barcelona",
    "El meu KPI preferit és arribar a divendres. Fet amb ♥ a Barcelona",
    "Dades a l'esquerra, cafè a la dreta, caos al mig. Fet amb ♥ a Barcelona",
    "Fet amb ♥ a Barcelona, on fins i tot els residus tenen patró.",
    "Contrastant hipòtesis, mai els meus horaris de son. Fet amb ♥ a Barcelona",
    "Un boxplot no menteix, els meus hàbits sí. Fet amb ♥ a Barcelona",
    "Sempre hi ha un decimal de més o de menys. Fet amb ♥ a Barcelona",
    "Variança alta, la paciència també. Fet amb ♥ a Barcelona",
    "Tot té una distribució, fins i tot la mandra. Fet amb ♥ a Barcelona",
    "Prediccions optimistes, resultats amb marge d'error. Fet amb ♥ a Barcelona",
    "La mitjana diu que estic bé. La mediana no ho té tan clar. Fet amb ♥ a Barcelona",
    "Aquí s'analitzen dades, no excuses. Bé, alguna sí. Fet amb ♥ a Barcelona",
    "Un algoritme de recomanació per decidir què sopar. Fet amb ♥ a Barcelona",
    "Sense outliers la vida seria molt avorrida. Fet amb ♥ a Barcelona",
    "Un pipeline de dades més net que la meva cuina. Fet amb ♥ a Barcelona",
    "Aquí es validen models, no decisions preses a les 2 AM. Fet amb ♥ a Barcelona",
    "Random seed fixat, resultats de la vida no tant. Fet amb ♥ a Barcelona",
    "Fet amb ♥ a Barcelona, capital mundial del biaix de confirmació... i del vermut.",
    "Tot input té un output, menys la son perduda. Fet amb ♥ a Barcelona",
    "Aquest peu de pàgina també és un experiment controlat. Fet amb ♥ a Barcelona"
  ];

  quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
})();

/* ---------- Cerca i filtre per etiquetes (portada) ---------- */
(function () {
  var searchInput = document.getElementById('search-input');
  var cardGrid = document.getElementById('card-grid');
  if (!searchInput || !cardGrid) return;

  var tagButtons = document.querySelectorAll('.tag-chip');
  var cards = Array.prototype.slice.call(cardGrid.querySelectorAll('.card'));
  var resultCount = document.getElementById('result-count');
  var emptyState = document.getElementById('empty-state');
  var activeTag = 'all';

  function paramTag() {
    var params = new URLSearchParams(window.location.search);
    return params.get('tag');
  }

  function applyFilters() {
    var query = (searchInput.value || '').trim().toLowerCase();
    var visible = 0;

    cards.forEach(function (card) {
      var matchesTag = activeTag === 'all' || (card.dataset.tags || '').split(' ').indexOf(activeTag) !== -1;
      var haystack = card.dataset.title + ' ' + card.dataset.excerpt + ' ' + card.dataset.tags + ' ' + card.dataset.content;
      var matchesQuery = query === '' || haystack.indexOf(query) !== -1;
      var show = matchesTag && matchesQuery;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (resultCount) resultCount.textContent = visible + (visible === 1 ? ' entrada trobada' : ' entrades trobades');
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  tagButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tagButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeTag = btn.dataset.tag;
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);

  var initialTag = paramTag();
  if (initialTag) {
    var match = Array.prototype.find.call(tagButtons, function (b) { return b.dataset.tag === initialTag; });
    if (match) {
      tagButtons.forEach(function (b) { b.classList.remove('active'); });
      match.classList.add('active');
      activeTag = initialTag;
    }
  }

  applyFilters();
})();

/* ---------- Taula de continguts amb scrollspy (article) ---------- */
(function () {
  var content = document.getElementById('post-content');
  var tocNav = document.getElementById('toc-nav');
  var tocAside = document.querySelector('.post-toc');
  if (!content || !tocNav || !tocAside) return;

  var headings = Array.prototype.slice.call(content.querySelectorAll('h2, h3'));
  if (headings.length < 2) {
    tocAside.style.display = 'none';
    return;
  }

  var links = [];

  headings.forEach(function (heading, i) {
    if (!heading.id) {
      heading.id = 'sec-' + i;
    }
    var a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;
    a.className = heading.tagName === 'H3' ? 'toc-level-3' : 'toc-level-2';
    tocNav.appendChild(a);
    links.push({ id: heading.id, el: a });
  });

  function setActive(id) {
    links.forEach(function (link) {
      link.el.classList.toggle('active', link.id === id);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    var visible = entries
      .filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });

    if (visible.length > 0) {
      setActive(visible[0].target.id);
    }
  }, {
    rootMargin: '-96px 0px -70% 0px',
    threshold: 0
  });

  headings.forEach(function (heading) { observer.observe(heading); });

  if (headings.length) setActive(headings[0].id);
})();

// Compartir: copiar enllaç al porta-retalls
(function () {
  var btn = document.querySelector('.share-copy');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var url = btn.getAttribute('data-url');
    navigator.clipboard.writeText(url).then(function () {
      btn.classList.add('copied');
      setTimeout(function () { btn.classList.remove('copied'); }, 1500);
    });
  });
})();
