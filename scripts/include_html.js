// Função para carregar HTML e processar CSS
async function loadHTML(id, url) {
    const container = document.getElementById(id);
    if (!container) {
      console.error(`Elemento com ID '${id}' não encontrado.`);
      return;
    }
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro ao carregar ${url}: ${response.status}`);
      const data = await response.text();
      container.innerHTML = data;
  
      // Processar <link> CSS dentro do HTML carregado
      const links = container.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        if (!document.querySelector(`link[href="${link.href}"]`)) {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = link.href;
          document.head.appendChild(newLink);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
  
  // Lista de componentes a carregar
  const components = [
    { id: 'header', url: 'header.html' },
    { id: 'footer', url: 'footer_wpp.html' }
  ];
  
  // Carregar todos os componentes
  document.addEventListener('DOMContentLoaded', () => {
    components.forEach(c => loadHTML(c.id, c.url));
  });
  