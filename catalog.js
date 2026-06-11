    const SUPABASE_URL = 'https://eodkpelkplrgqxbmkqka.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZGtwZWxrcGxyZ3F4Ym1rcWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDU1MjksImV4cCI6MjA5NDI4MTUyOX0.ZWNwMsCZO6P4VcVUjOB9Zt7-95qoWziYuf21fHo7mRU';

    const { createClient } = window.supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let WHATSAPP_NUMBER = "18292727257";
    let siteSettings = null;

    // Theme
    function initTheme() {
        const savedTheme = localStorage.getItem('catalogue-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function showToast(message) {
        let toast = document.getElementById('toast-share');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-share';
            toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);padding:12px 24px;background:var(--bg-elevated);border:1px solid var(--gold);border-radius:8px;font-size:0.9rem;z-index:9999;opacity:0;transition:all 0.3s;pointer-events:none;';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            toast.style.opacity = '0';
        }, 2500);
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
    let currentImageIndex = 0;

    function obtenerImagenes(producto) {
        if (Array.isArray(producto.images) && producto.images.length > 0) return producto.images;
        if (producto.images) return [producto.images];
        if (producto.image) return [producto.image];
        return [];
    }

    function shareUrl(producto) {
        const url = `${window.location.origin}/producto?id=${producto.id}`;
        if (navigator.share) {
            navigator.share({
                title: producto.name,
                text: `Mira este producto: ${producto.name} - ${producto.price}`,
                url: url
            }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                showToast('Link copiado al portapapeles');
            }).catch(() => {
                prompt('Copiá este link:', url);
            });
        } else {
            prompt('Copiá este link:', url);
        }
    }

    function crearTarjetaProducto(producto) {
        const mensajeWhatsApp = `Hola, me interesa este producto: ${producto.name} - ${producto.price}`;
        const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajeWhatsApp)}`;
        
        const imagenes = obtenerImagenes(producto);
        return `
            <article class="product-card" data-id="${producto.id}">
                <div class="product-image-container">
                    <img src="${imagenes[0]}" alt="${producto.name}" class="product-image" loading="lazy">
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
                        <button class="btn-share" onclick="shareUrl(products.find(p => p.id === '${producto.id}'))" title="Compartir">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
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

    async function loadSettings() {
        try {
            const { data } = await supabaseClient
                .from('site_settings')
                .select('*')
                .eq('id', 1)
                .single();
            if (data) {
                siteSettings = data;
                WHATSAPP_NUMBER = data.whatsapp || WHATSAPP_NUMBER;
            }
        } catch (e) {
            console.warn('Error loading settings, using defaults:', e);
        }
    }

    function renderizarCategorias() {
        const container = document.querySelector('.categories');
        const cats = siteSettings?.categories || ['general'];
        container.innerHTML = `
            <button class="category-btn active" data-category="all">Todos</button>
            ${cats.map(c => `<button class="category-btn" data-category="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</button>`).join('')}
        `;
        container.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category;
                renderizarProductos();
            });
        });
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

    function mostrarImagenModal(index) {
        const producto = products.find(p => p.id === selectedProductForModal);
        if (!producto) return;
        const imagenes = obtenerImagenes(producto);
        if (index < 0 || index >= imagenes.length) return;
        currentImageIndex = index;
        modalImage.src = imagenes[index];
        modalImage.alt = producto.name;

        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');
        const counter = document.getElementById('galleryCounter');
        if (prevBtn) prevBtn.style.display = imagenes.length > 1 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = imagenes.length > 1 ? 'flex' : 'none';
        if (counter) counter.textContent = `${index + 1} / ${imagenes.length}`;
    }

    function abrirModal(productId) {
        const producto = products.find(p => p.id === productId);
        
        if (!producto) return;
        
        selectedProductForModal = producto.id;
        
        mostrarImagenModal(0);
        modalName.textContent = producto.name;
        modalPrice.textContent = producto.price;
        modalDescription.textContent = producto.description || '';
        modalCategory.textContent = producto.category;
        
        const mensajeWhatsApp = `Hola, me interesa este producto: ${producto.name} - ${producto.price}`;
        modalWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajeWhatsApp)}`;

        const modalShareBtn = document.getElementById('modalShareBtn');
        modalShareBtn.onclick = () => shareUrl(producto);
        
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

    modalClose.addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', cerrarModal);

    document.getElementById('galleryPrev').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentImageIndex > 0) mostrarImagenModal(currentImageIndex - 1);
    });

    document.getElementById('galleryNext').addEventListener('click', (e) => {
        e.stopPropagation();
        const producto = products.find(p => p.id === selectedProductForModal);
        if (!producto) return;
        const imagenes = obtenerImagenes(producto);
        if (currentImageIndex < imagenes.length - 1) mostrarImagenModal(currentImageIndex + 1);
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') {
            cerrarModal();
        } else if (e.key === 'ArrowLeft') {
            const producto = products.find(p => p.id === selectedProductForModal);
            if (!producto) return;
            const imagenes = obtenerImagenes(producto);
            if (currentImageIndex > 0) mostrarImagenModal(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight') {
            const producto = products.find(p => p.id === selectedProductForModal);
            if (!producto) return;
            const imagenes = obtenerImagenes(producto);
            if (currentImageIndex < imagenes.length - 1) mostrarImagenModal(currentImageIndex + 1);
        }
    });

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Init
    document.addEventListener('DOMContentLoaded', async () => {
        initTheme();
        await loadSettings();
        renderizarCategorias();
        loadProducts();
    });