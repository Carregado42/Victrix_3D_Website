// ======= PEGAR ELEMENTO BASE =======
// Seleciona o container principal ou cria um novo caso não exista
const mainContainer = document.body.querySelector('.product-detail-container') 
  || (() => {
    const section = document.createElement('section');
    section.className = 'product-detail-container';
    document.body.insertBefore(section, document.querySelector('footer'));
    return section;
  })();

// ======= PEGAR PARÂMETROS DA URL =======
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));
const categoria = params.get('categoria');

if (!productId || !categoria) {
  console.error('ID do produto ou categoria não encontrados na URL');
}

// ======= FUNÇÃO PARA CRIAR HTML DO PRODUTO =======
function criarEstruturaProduto(produto) {
  // Cria a estrutura principal do produto
  mainContainer.innerHTML = `
    <section class="product-detail-container">
      <div class="product-images">
        <img id="main-product-image" class="product-image-main" src="${produto.image}" alt="${produto.name}">
        <div class="product-image-thumbs" id="thumbs"></div>
      </div>

      <div class="product-info">
        <h2 class="product-name">${produto.name}</h2>
        <p class="product-category">${produto.category}</p>
        <div class="product-meta">
          <span class="price">${produto.price}</span>
          <span class="availability ${produto.stock > 0 ? 'in-stock' : 'out-of-stock'}">
            ${produto.stock > 0 ? 'Em stock' : 'Esgotado'}
          </span>
        </div>
        <p class="product-description">${produto.description}</p>
        <button id="btn-voltar" class="btn-voltar">Voltar para categoria</button>
      </div>
    </section>
  `;

  // ======= BOTÃO DE VOLTAR =======
  const btnVoltar = document.getElementById('btn-voltar');
  btnVoltar.addEventListener('click', () => {
    if (categoria) {
      // Redireciona para a página da categoria (nome do HTML = categoria)
      window.location.href = `./${categoria}.html`;
    } else {
      // Caso não exista categoria, volta para a página anterior
      window.history.back();
    }
  });

  // ======= MINIATURAS E IMAGEM PRINCIPAL =======
  const thumbsContainer = document.getElementById('thumbs');
  const mainImage = document.getElementById('main-product-image');

  let images = [];

  // Verifica se o JSON possui array de imagens ou propriedades image1, image2...
  if (Array.isArray(produto.images) && produto.images.length > 0) {
    images = produto.images.filter(Boolean);
  } else {
    images = Object.keys(produto)
      .filter(k => k.startsWith('image'))
      .map(k => produto[k])
      .filter(Boolean);
  }

  // Remove duplicadas
  images = [...new Set(images)];

  // Cria miniaturas e define a primeira imagem como principal
  thumbsContainer.innerHTML = '';
  images.forEach((imgSrc, index) => {
    const thumb = document.createElement('img');
    thumb.src = imgSrc;
    thumb.classList.add('thumb');
    thumb.alt = `Thumb ${index + 1}`;
    thumb.dataset.index = index;

    if (index === 0) {
      thumb.classList.add('active');
      mainImage.src = imgSrc;
    }

    thumb.addEventListener('click', () => {
      mainImage.src = thumb.src;
      thumbsContainer.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });

    thumbsContainer.appendChild(thumb);
  });
}

// ======= FUNÇÃO PARA CARREGAR PRODUTO DO JSON =======
async function carregarProduto() {
  try {
    const res = await fetch(`../json/${categoria}.json`);
    const produtos = await res.json();

    const produto = produtos.find(p => p.id === productId);
    if (!produto) return console.error('Produto não encontrado');

    criarEstruturaProduto(produto);
  } catch (err) {
    console.error('Erro ao carregar produto:', err);
  }
}

// ======= INICIALIZAÇÃO =======
carregarProduto();
