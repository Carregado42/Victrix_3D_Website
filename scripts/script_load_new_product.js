async function loadNewProducts() {
    const grid = document.getElementById('product-display-grid');
    if (!grid) return;

    // Defina aqui todos os caminhos para os seus arquivos JSON
    const jsonFiles = [
        '../json/diversos.json',
        '../json/decoracao.json',
        '../json/conquistas.json',
        // Adicione outros arquivos JSON aqui, se houver
    ];

    let allProducts = [];

    try {
        const fetchPromises = jsonFiles.map(fileUrl => fetch(fileUrl));
        const responses = await Promise.all(fetchPromises);

        for (const response of responses) {
            if (!response.ok) {
                throw new Error(`Erro ao carregar JSON: ${response.url} - ${response.status}`);
            }
        }

        const productsArrays = await Promise.all(responses.map(response => response.json()));

        productsArrays.forEach(products => {
            allProducts = allProducts.concat(products);
        });
        
        // Filtra apenas produtos onde a propriedade 'new' é true
        const newProducts = allProducts.filter(p => p.new === true);
  
        // Cria elementos HTML para cada produto
        newProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-card');

            // Lógica de formatação de preço aprimorada
            let productPriceFormatted = product.price;

            if (typeof product.price === 'string') {
                try {
                    const priceValue = parseFloat(product.price.replace('€', '').replace(',', '.').trim());
                    if (!isNaN(priceValue)) {
                        productPriceFormatted = `€${priceValue.toFixed(2)}`;
                    }
                } catch (e) {
                    productPriceFormatted = product.price; 
                }
            } else if (typeof product.price === 'number') {
                productPriceFormatted = `€${product.price.toFixed(2)}`;
            }
            
            // Usamos '../pages/produto.html' e passamos a categoria
            productDiv.innerHTML = 
              `<a href="../pages/produto.html?id=${product.id}&categoria=${product.category}" class="product-link">
                ${product.new ? '<span class="badge-new">Novo</span>' : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${productPriceFormatted}</p>
               </a>`; 
            
            grid.appendChild(productDiv);
        });
  
    } catch (err) {
      console.error("Erro ao carregar ou processar JSONs:", err);
    }
}
  
// Executa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadNewProducts);