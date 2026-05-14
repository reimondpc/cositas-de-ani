    const SUPABASE_URL = 'https://eodkpelkplrgqxbmkqka.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZGtwZWxrcGxyZ3F4Ym1rcWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDU1MjksImV4cCI6MjA5NDI4MTUyOX0.ZWNwMsCZO6P4VcVUjOB9Zt7-95qoWziYuf21fHo7mRU';

    const { createClient } = window.supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const WHATSAPP_NUMBER = "18292727257";

    // Theme
    function initTheme() {
        const savedTheme = localStorage.getItem('catalogue-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('catalogue-theme', newTheme);
    }

    // DOM Elements
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const noResults = document.getElementById('noResults');

    const modal = document.getElementById('modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');
    const modalCategory = document.getElementById('modalCategory');
    const modalWhatsapp = document.getElementById('modalWhatsapp');

    let products = [];
    let currentCategory = 'all';
    let currentSearch = '';
    let selectedProductForModal = null;

    function crearTarjetaProducto(producto) {
        const mensajeWhatsApp = `Hola, me interesa este producto: ${producto.name} - ${producto.price}`;
        const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajeWhatsApp)}`;
        
        return `
            <article class="product-card" data-id="${producto.id}">
                <div class="product-image-container">
                    <img src="${producto.image}" alt="${producto.name}" class="product-image" loading="lazy">
                    <span class="product-badge">${producto.category}</span>
                    <div class="product-overlay"></div>
                    <div class="product-line"></div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${producto.name}</h3>
                    <p class="product-price">${producto.price}</p>
                    <p class="product-description">${producto.description || ''}</p>
                    <div class="product-actions">
                        <button class="btn-details" onclick="abrirModal('${producto.id}')">
                            Ver detalles
                        </button>
                        <a href="${linkWhatsApp}" target="_blank" class="btn-whatsapp-small" title="Comprar por WhatsApp">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    function filtrarProductos() {
        return products.filter(producto => {
            const coincideCategoria = currentCategory === 'all' || producto.category === currentCategory;
            const coincideBusqueda = currentSearch === '' || 
                producto.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                (producto.description && producto.description.toLowerCase().includes(currentSearch.toLowerCase()));
            
            return coincideCategoria && coincideBusqueda;
        });
    }

    function renderizarProductos() {
        const productosFiltrados = filtrarProductos();
        
        if (productosFiltrados.length === 0) {
            productsGrid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        productsGrid.innerHTML = productosFiltrados.map(crearTarjetaProducto).join('');
    }

    async function loadProducts() {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            products = data;
            renderizarProductos();
            addProductStructuredData(data);
        }
    }

    function addProductStructuredData(products) {
        const existing = document.getElementById('product-ld-json');
        if (existing) existing.remove();
        const script = document.createElement('script');
        script.id = 'product-ld-json';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'itemListElement': products.map((p, i) => ({
                '@type': 'ListItem',
                'position': i + 1,
                'item': {
                    '@type': 'Product',
                    'name': p.name,
                    'description': p.description || '',
                    'offers': {
                        '@type': 'Offer',
                        'price': p.price.replace('RD$', ''),
                        'priceCurrency': 'DOP',
                        'availability': 'https://schema.org/InStock'
                    }
                }
            }))
        });
        document.head.appendChild(script);
    }

    function abrirModal(productId) {
        const producto = products.find(p => p.id === productId);
        
        if (!producto) return;
        
        selectedProductForModal = producto.id;
        
        modalImage.src = producto.image;
        modalImage.alt = producto.name;
        modalName.textContent = producto.name;
        modalPrice.textContent = producto.price;
        modalDescription.textContent = producto.description || '';
        modalCategory.textContent = producto.category;
        
        const mensajeWhatsApp = `Hola, me interesa este producto: ${producto.name} - ${producto.price}`;
        modalWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajeWhatsApp)}`;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderizarProductos();
    });

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderizarProductos();
        });
    });

    modalClose.addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', cerrarModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            cerrarModal();
        }
    });

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Init
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        loadProducts();
    });