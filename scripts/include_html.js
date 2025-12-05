// Função para corrigir caminhos absolutos para relativos
function corrigirCaminhosAbsolutos(elemento) {
  const currentPath = window.location.pathname;
  const isInPages = currentPath.includes('/pages/');
  const prefixo = isInPages ? '../' : '';
  
  // Corrigir atributos src (imagens, scripts)
  if (elemento.hasAttribute('src')) {
    let src = elemento.getAttribute('src');
    if (src && src.startsWith('/') && !src.startsWith('//') && !src.startsWith('http')) {
      elemento.setAttribute('src', prefixo + src.substring(1));
    }
  }
  
  // Corrigir atributos href (links, stylesheets)
  if (elemento.hasAttribute('href')) {
    let href = elemento.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('http')) {
      elemento.setAttribute('href', prefixo + href.substring(1));
    }
  }
}

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
  
      // Processar <link> CSS dentro do HTML carregado e corrigir caminhos
      const links = container.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        corrigirCaminhosAbsolutos(link);
        if (!document.querySelector(`link[href="${link.href}"]`)) {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = link.getAttribute('href');
          document.head.appendChild(newLink);
        }
      });
      
      // Corrigir caminhos absolutos em todos os elementos com src ou href
      const elementosComCaminhos = container.querySelectorAll('[src], [href]');
      elementosComCaminhos.forEach(elemento => {
        corrigirCaminhosAbsolutos(elemento);
      });
    } catch (err) {
      console.error(`Erro ao carregar ${url}:`, err);
    }
  }
  
  // Carregar todos os componentes
  document.addEventListener('DOMContentLoaded', () => {
    // Determinar a localização atual da página
    const currentPath = window.location.pathname;
    const isInPages = currentPath.includes('/pages/');
    
    // Se estamos em pages/, os componentes estão na mesma pasta
    // Se estamos na raiz, os componentes estão em pages/
    const components = [
      { id: 'header', url: isInPages ? 'header.html' : 'pages/header.html' },
      { id: 'footer', url: isInPages ? 'footer_wpp.html' : 'pages/footer_wpp.html' }
    ];
    
    components.forEach(c => loadHTML(c.id, c.url));
  });
  