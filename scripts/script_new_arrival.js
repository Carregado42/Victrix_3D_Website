fetch('../json/new_products.json')
  .then(res => res.json())
  .then(products => {
    const grid = document.getElementById('new-arrivals-grid');

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
    
      card.innerHTML = `
        <a href="../pages/produto.html?id=${p.id}&categoria=new_products" class="product-link">
          ${p.new ? '<span class="badge-new">Novo</span>' : ''}
          <img src="${p.image}" alt="${p.name}" />
          <h4>${p.name}</h4>
          <div class="price">${p.price}</div>
        </a>
      `;
      grid.appendChild(card);
    });
  })
  .catch(err => console.error('Erro ao carregar produtos:', err));


