// ======= ELEMENTOS =======
const mainImage = document.getElementById('main-product-image');
const productName = document.querySelector('.product-info h1');
const productPrice = document.querySelector('.product-info .price');
const productAvailability = document.querySelector('.product-info .availability span');
const productCategory = document.querySelectorAll('.product-info p strong')[0];
const productDescription = document.querySelectorAll('.product-info p')[1];
const thumbsContainer = document.getElementById('thumbs');

// ======= PEGAR PARAMETROS DA URL =======
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));
const categoria = params.get('categoria'); // ex: "categoria1"

if (!productId || !categoria) {
  console.error('ID do produto ou categoria não encontrados na URL');
}

// ======= CARREGAR PRODUTO =======
async function carregarProduto() {
  try {
    const res = await fetch(`../json/${categoria}.json`);
    const produtos = await res.json();

    const produto = produtos.find(p => p.id === productId);
    if (!produto) return console.error('Produto não encontrado');

    // Atualiza HTML
    mainImage.src = produto.image;
    productName.textContent = produto.name;
    productPrice.textContent = produto.price;
    productAvailability.textContent = produto.stock;
    productCategory.textContent = produto.category;
    productDescription.textContent = produto.description;

    // Miniaturas (se houver)
    thumbsContainer.innerHTML = '';
    const images = produto.images || [produto.image, produto.image2, produto.image, produto.image];
    images.forEach((imgSrc, index) => {
      const thumb = document.createElement('img');
      thumb.src = imgSrc;
      thumb.classList.add('thumb');
      if (index === 0) thumb.classList.add('active');
      thumb.dataset.index = index;
      thumb.alt = `Thumb ${index+1}`;
      thumbsContainer.appendChild(thumb);

      thumb.addEventListener('click', () => {
        mainImage.src = thumb.src;
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

  } catch (err) {
    console.error('Erro ao carregar produto:', err);
  }
}

carregarProduto();
