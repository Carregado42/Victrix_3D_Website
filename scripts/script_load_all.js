async function loadAllProducts() {
    const grid = document.getElementById('product-display-grid');
    if (!grid) return;

    // 1. LISTE AQUI TODOS OS SEUS FICHEIROS JSON DE PRODUTOS
    // Estes ficheiros serão combinados e todos os produtos serão exibidos.
    const jsonFiles = [
        '../json/conquistas.json', 
        '../json/natal.json',
        '../json/portachaves.json', 
        //'../json/decoracao.json',
 

        // Adicione todos os seus ficheiros JSON de produtos aqui!
    ];

    let allProducts = [];

    try {
        // Carrega e aguarda todas as Promises de fetch em paralelo
        const fetchPromises = jsonFiles.map(fileUrl => fetch(fileUrl));
        const responses = await Promise.all(fetchPromises);

        // Verifica se houve falhas de rede (opcionalmente ignora e avisa)
        const validResponses = [];
        for (const response of responses) {
            if (response.ok) {
                validResponses.push(response);
            } else {
                console.warn(`Aviso: Falha ao carregar JSON: ${response.url} - ${response.status}. Este ficheiro será ignorado.`);
            }
        }

        // Aguarda que o conteúdo de todos os ficheiros VÁLIDOS seja lido (JSON parsing)
        const productsArrays = await Promise.all(validResponses.map(response => response.json()));

        // Combina todos os produtos de todos os ficheiros
        productsArrays.forEach(products => {
            allProducts = allProducts.concat(products);
        });
        
        // **!!! IMPORTANTE !!!**
        // A linha de filtro (allProducts.filter(p => p.new === true);) FOI REMOVIDA.
        // O array 'allProducts' agora contém TODOS os produtos carregados.
        
        const productsToDisplay = allProducts;
        
        // 2. Cria elementos HTML para CADA produto
        productsToDisplay.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-card');

            // Lógica de formatação de preço (reutilizada)
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
            
            // Link que replica o comportamento das suas outras páginas
            // Nota: O 'p.new' é verificado para mostrar o badge 'Novo' se o produto for novo.
            productDiv.innerHTML = 
              `<a href="../pages/produto.html?id=${product.id}&categoria=${product.category}" class="product-link">
                ${product.new ? '<span class="badge-new">Novo</span>' : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3 class="product-name">${product.name}</h3>
                <p class="price">${productPriceFormatted}</p>
               </a>`; 
            
            grid.appendChild(productDiv);
        });
  
    } catch (err) {
      console.error("Erro fatal ao carregar ou processar JSONs:", err);
    }
}
  
// Executa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadAllProducts);