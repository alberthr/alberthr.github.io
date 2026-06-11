// Índex de cerca que es carrega del JSON
let searchIndex = [];

// Carregar l'índex JSON quan es carregui la pàgina
document.addEventListener('DOMContentLoaded', function() {
  loadSearchIndex();
  setupSearchListener();
});

// Carregar l'índex JSON
function loadSearchIndex() {
  fetch('/search-index.json')
    .then(response => response.json())
    .then(data => {
      searchIndex = data;
    })
    .catch(error => console.error('Error carregant índex de cerca:', error));
}

// Configurar l'event listener de la barra de cerca
function setupSearchListener() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keyup', function() {
      performSearch(this.value);
    });
  }
}

// Funció de cerca
function performSearch(query) {
  const searchTerm = query.toLowerCase().trim();
  const posts = document.querySelectorAll('.post-item');
  const postUrlsToShow = new Set();

  // Si la cerca està buida, mostrar tots els posts
  if (searchTerm === '') {
    posts.forEach(post => post.style.display = 'block');
    removeNoResultsMessage();
    return;
  }

  // Buscar en l'índex JSON
  searchIndex.forEach(post => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm);
    const contentMatch = post.content.toLowerCase().includes(searchTerm);
    const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

    if (titleMatch || contentMatch || tagsMatch) {
      postUrlsToShow.add(post.url);
    }
  });

  // Mostrar/amagar posts segons els resultats de cerca
  let visibleCount = 0;
  posts.forEach(post => {
    const postUrl = post.querySelector('.post-link').getAttribute('href');
    if (postUrlsToShow.has(postUrl)) {
      post.style.display = 'block';
      visibleCount++;
    } else {
      post.style.display = 'none';
    }
  });

  // Mostrar missatge si no hi ha resultats
  if (visibleCount === 0) {
    showNoResultsMessage(searchTerm);
  } else {
    removeNoResultsMessage();
  }
}

// Mostrar missatge de no resultats
function showNoResultsMessage(searchTerm) {
  removeNoResultsMessage();
  const postsList = document.getElementById('llista-posts');
  if (postsList) {
    const message = document.createElement('li');
    message.className = 'no-results-message';
    message.style.cssText = 'text-align: center; color: #999; padding: 2rem; font-style: italic;';
    message.textContent = `No s'han trobat posts amb "${searchTerm}"`;
    postsList.appendChild(message);
  }
}

// Eliminar missatge de no resultats
function removeNoResultsMessage() {
  const noResultsMsg = document.querySelector('.no-results-message');
  if (noResultsMsg) {
    noResultsMsg.remove();
  }
}