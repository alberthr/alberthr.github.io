// Funcionalitat de cerca avançada en temps real
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  
  if (searchInput) {
    searchInput.addEventListener('keyup', function(e) {
      performSearch(this.value);
    });
  }
});

// Treu la vora inferior del darrer post visible (filtratge per tags o cerca)
function actualitzarVoraDarrerPost() {
  const posts = document.querySelectorAll('.post-item');
  let darrerVisible = null;

  posts.forEach(post => {
    post.classList.remove('no-border');
    if (post.style.display !== 'none') {
      darrerVisible = post;
    }
  });

  if (darrerVisible) {
    darrerVisible.classList.add('no-border');
  }
}

function performSearch(query) {
  const posts = document.querySelectorAll('.post-item');
  const searchTerm = query.toLowerCase().trim();
  let visibleCount = 0;

  posts.forEach(post => {
    const title = post.querySelector('.post-link').textContent.toLowerCase();
    const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
    const tags = post.getAttribute('data-tags').toLowerCase();
    
    // Cercar en títol, resum i tags
    const matches = title.includes(searchTerm) || 
                    excerpt.includes(searchTerm) || 
                    tags.includes(searchTerm);
    
    if (matches || searchTerm === '') {
      post.style.display = 'block';
      visibleCount++;
    } else {
      post.style.display = 'none';
    }
  });

  // Mostrar missatge si no hi ha resultats
  const postsList = document.getElementById('llista-posts');
  if (postsList && visibleCount === 0 && searchTerm !== '') {
    if (!document.querySelector('.no-results-message')) {
      const message = document.createElement('li');
      message.className = 'no-results-message';
      message.style.cssText = 'text-align: center; color: #999; padding: 2rem; font-style: italic;';
      message.textContent = `No s'han trobat posts amb "${searchTerm}"`;
      postsList.appendChild(message);
    }
  } else if (document.querySelector('.no-results-message')) {
    document.querySelector('.no-results-message').remove();
  }

  actualitzarVoraDarrerPost();
}
