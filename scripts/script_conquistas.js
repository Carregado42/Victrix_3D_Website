fetch('../scripts/conquistas.json')
  .then(res => res.json())
  .then(products => {
    const grid = document.getElementById('new-arrivals-grid');

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'new-arrival-card';

      card.innerHTML = `
        ${p.new ? '<span class="badge-new">Novo</span>' : ''}
        <img src="${p.image}" alt="${p.name}" />
        <h4>${p.name}</h4>
        <div class="price">${p.price}</div>
      `;

      grid.appendChild(card);
    });
  })
  .catch(err => console.error('Erro ao carregar produtos:', err));


