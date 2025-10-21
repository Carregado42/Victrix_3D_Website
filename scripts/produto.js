// Ler o parâmetro ?id= da URL
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

// Buscar os produtos do JSON
fetch('../scripts/conquistas.json')
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id === productId);
    const container = document.getElementById('product-detail-container');

    if (!product) {
      container.innerHTML = '<p>Produto não encontrado.</p>';
      return;
    }

    container.innerHTML = `
      <div class="product-detail-card">
        <img src="${product.image}" alt="${product.name}" />
        <h1>${product.name}</h1>
        <p class="price">${product.price}</p>
        <p>${product.description || 'Sem descrição disponível.'}</p>
      </div>
    `;
  });
