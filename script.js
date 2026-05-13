/* ========================================
   CATÁLOGO DE VENTAS - JAVASCRIPT
   ======================================== */

// ==========================================
// CONFIGURACIÓN
// ==========================================

// Número de WhatsApp (sin + ni guiones)
// Ejemplo: 18292727257
const WHATSAPP_NUMBER = "18292727257";

// ==========================================
// SISTEMA DE TEMA
// ==========================================

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

// ==========================================
// ARRAY DE PRODUCTOS
// ==========================================
// Agrega, modifica o elimina productos aquí
// Estructura:
// - nombre: Título del producto
// - precio: Precio con formato (ej: "$99.99" o "Consultar")
// - descripcion: Descripción completa del producto
// - categoria: Categoría para filtrar (usa "general" si no tienes categorías)
// - imagen: Ruta a la imagen en la carpeta /images
// ==========================================

const productos = [
    {
        nombre: "Producto Premium 1",
        precio: "$149.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001647064.jpg"
    },
    {
        nombre: "Producto Elite 2",
        precio: "$229.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001648949.png"
    },
    {
        nombre: "Producto Special 3",
        precio: "$189.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001648950.png"
    },
    {
        nombre: "Producto Premium 4",
        precio: "$159.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001648951.png"
    },
    {
        nombre: "Producto Deluxe 5",
        precio: "$79.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001656365.jpg"
    },
    {
        nombre: "Producto Classic 6",
        precio: "$99.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001671617.jpg"
    },
    {
        nombre: "Producto Moderno 7",
        precio: "$279.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001675284.png"
    },
    {
        nombre: "Producto Exclusivo 8",
        precio: "$349.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001675285.png"
    },
    {
        nombre: "Producto VIP 9",
        precio: "$199.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001675302.png"
    },
    {
        nombre: "Producto Unique 10",
        precio: "$259.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001675303.png"
    },
    {
        nombre: "Producto Style 11",
        precio: "$69.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001677539.jpg"
    },
    {
        nombre: "Producto Trend 12",
        precio: "$89.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001677540.jpg"
    },
    {
        nombre: "Producto Fresh 13",
        precio: "$119.99",
        descripcion: "Descripción detallada del producto. Incluye todas las características principales, especificaciones técnicas y beneficios clave. Producto de alta calidad con garantía.",
        categoria: "general",
        imagen: "images/1001677541.jpg"
    }
];

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const noResults = document.getElementById('noResults');

// Elementos del modal
const modal = document.getElementById('modal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');
const modalCategory = document.getElementById('modalCategory');
const modalWhatsapp = document.getElementById('modalWhatsapp');

// ==========================================
// VARIABLES DE ESTADO
// ==========================================
let currentCategory = 'all';
let currentSearch = '';
let editingProductName = null;
let selectedProductForModal = null;

// ==========================================
// ELEMENTOS DEL DOM (Admin)
// ==========================================
const adminPanel = document.getElementById('adminPanel');
const adminProductList = document.getElementById('adminProductList');
const adminModal = document.getElementById('adminModal');
const adminTitle = document.getElementById('adminTitle');
const productForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productDescriptionInput = document.getElementById('productDescription');
const productCategoryInput = document.getElementById('productCategory');
const productImageInput = document.getElementById('productImage');
const toast = document.getElementById('toast');
const editProductBtn = document.getElementById('editProductBtn');
const deleteProductBtn = document.getElementById('deleteProductBtn');
const addProductBtn = document.getElementById('addProductBtn');
const adminCloseBtn = document.querySelector('.admin-panel-close');
const adminCloseFormBtn = document.querySelector('.admin-close');

// ==========================================
// FUNCIONES DE RENDERIZADO
// ==========================================

/**
 * Genera el HTML de una tarjeta de producto
 * @param {Object} producto - Datos del producto
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaProducto(producto) {
    const mensajeWhatsApp = `Hola, me interesa este producto: ${producto.nombre} - ${producto.precio}`;
    const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajeWhatsApp)}`;
    
    return `
        <article class="product-card" data-id="${producto.nombre}">
            <div class="product-image-container">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" loading="lazy">
                <span class="product-badge">${producto.categoria}</span>
                <div class="product-overlay"></div>
                <div class="product-line"></div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${producto.nombre}</h3>
                <p class="product-price">${producto.precio}</p>
                <p class="product-description">${producto.descripcion}</p>
                <div class="product-actions">
                    <button class="btn-details" onclick="abrirModal('${producto.nombre}')">
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

/**
 * Renderiza todos los productos en el grid
 */
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

/**
 * Filtra productos por categoría y búsqueda
 * @returns {Array} Productos filtrados
 */
function filtrarProductos() {
    return productos.filter(producto => {
        const coincideCategoria = currentCategory === 'all' || producto.categoria === currentCategory;
        const coincideBusqueda = currentSearch === '' || 
            producto.nombre.toLowerCase().includes(currentSearch.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(currentSearch.toLowerCase());
        
        return coincideCategoria && coincideBusqueda;
    });
}

// ==========================================
// FUNCIONES DEL MODAL
// ==========================================

/**
 * Abre el modal con los detalles del producto
 * @param {string} nombreProducto - Nombre del producto a mostrar
 */
function abrirModal(nombreProducto) {
    const producto = productos.find(p => p.nombre === nombreProducto);
    
    if (!producto) return;
    
    selectedProductForModal = producto.nombre;
    
    // Llenar datos del modal
    modalImage.src = producto.imagen;
    modalImage.alt = producto.nombre;
    modalName.textContent = producto.nombre;
    modalPrice.textContent = producto.precio;
    modalDescription.textContent = producto.descripcion;
    modalCategory.textContent = producto.categoria;
    
    // Configurar link de WhatsApp
    const mensajeWhatsApp = `Hola, me interesa este producto: ${producto.nombre} - ${producto.precio}`;
    modalWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajeWhatsApp)}`;
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal
 */
function cerrarModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ==========================================
// FUNCIONES CRUD
// ==========================================

function abrirAdminPanel() {
    adminPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderizarAdminLista();
}

function cerrarAdminPanel() {
    adminPanel.classList.remove('active');
    document.body.style.overflow = '';
}

function abrirAdminModal(esEdicion = false) {
    if (esEdicion && editingProductName) {
        const producto = productos.find(p => p.nombre === editingProductName);
        if (producto) {
            adminTitle.textContent = 'Editar Producto';
            productNameInput.value = producto.nombre;
            productPriceInput.value = producto.precio;
            productDescriptionInput.value = producto.descripcion;
            productCategoryInput.value = producto.categoria;
            productImageInput.value = producto.imagen;
        }
    } else {
        adminTitle.textContent = 'Agregar Producto';
        productForm.reset();
        editingProductName = null;
    }
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarAdminModal() {
    adminModal.classList.remove('active');
    document.body.style.overflow = '';
    editingProductName = null;
    productForm.reset();
}

function mostrarToast(mensaje, tipo = 'success') {
    toast.textContent = mensaje;
    toast.className = 'toast ' + tipo;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function renderizarAdminLista() {
    adminProductList.innerHTML = productos.map((producto, index) => `
        <div class="admin-product-item">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="admin-product-info">
                <h4>${producto.nombre}</h4>
                <p>${producto.precio}</p>
            </div>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="editarProducto(${index})" title="Editar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="delete-btn" onclick="eliminarProducto(${index})" title="Eliminar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function editarProducto(index) {
    editingProductName = productos[index].nombre;
    abrirAdminModal(true);
}

function eliminarProducto(index) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        productos.splice(index, 1);
        renderizarAdminLista();
        renderizarProductos();
        mostrarToast('Producto eliminado correctamente');
    }
}

function guardarProducto(e) {
    e.preventDefault();
    
    const nombre = productNameInput.value.trim();
    const precio = productPriceInput.value.trim();
    const descripcion = productDescriptionInput.value.trim();
    const categoria = productCategoryInput.value;
    const imagen = productImageInput.value;

    if (!nombre || !precio || !imagen) {
        mostrarToast('Completa todos los campos requeridos', 'error');
        return;
    }

    if (editingProductName) {
        const index = productos.findIndex(p => p.nombre === editingProductName);
        if (index !== -1) {
            productos[index] = { nombre, precio, descripcion, categoria, imagen };
            mostrarToast('Producto actualizado correctamente');
        }
    } else {
        productos.push({ nombre, precio, descripcion, categoria, imagen });
        mostrarToast('Producto agregado correctamente');
    }

    cerrarAdminModal();
    renderizarAdminLista();
    renderizarProductos();
}

function abrirEditarDesdeModal() {
    if (selectedProductForModal) {
        editingProductName = selectedProductForModal;
        cerrarModal();
        abrirAdminModal(true);
    }
}

function abrirEliminarDesdeModal() {
    if (selectedProductForModal) {
        const index = productos.findIndex(p => p.nombre === selectedProductForModal);
        if (index !== -1) {
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                productos.splice(index, 1);
                renderizarAdminLista();
                renderizarProductos();
                cerrarModal();
                mostrarToast('Producto eliminado correctamente');
            }
        }
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Buscador en tiempo real
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    renderizarProductos();
});

// Botones de categoría
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Actualizar clase active
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Actualizar categoría y renderizar
        currentCategory = btn.dataset.category;
        renderizarProductos();
    });
});

// Cerrar modal
modalClose.addEventListener('click', cerrarModal);
modalOverlay.addEventListener('click', cerrarModal);

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        cerrarModal();
    }
    if (e.key === 'Escape' && adminModal.classList.contains('active')) {
        cerrarAdminModal();
    }
    if (e.key === 'Escape' && adminPanel.classList.contains('active')) {
        cerrarAdminPanel();
    }
});

// Admin button
document.getElementById('adminBtn').addEventListener('click', abrirAdminPanel);
adminCloseBtn.addEventListener('click', cerrarAdminPanel);
document.querySelector('.admin-panel-overlay').addEventListener('click', cerrarAdminPanel);

// Admin modal
addProductBtn.addEventListener('click', () => abrirAdminModal(false));
adminCloseFormBtn.addEventListener('click', cerrarAdminModal);
document.querySelector('#adminModal .modal-overlay').addEventListener('click', cerrarAdminModal);
productForm.addEventListener('submit', guardarProducto);

// Modal actions
editProductBtn.addEventListener('click', abrirEditarDesdeModal);
deleteProductBtn.addEventListener('click', abrirEliminarDesdeModal);

// ==========================================
// INICIALIZACIÓN
// ==========================================
function populateImageDropdown() {
    const images = [
        'images/1001647064.jpg',
        'images/1001648949.png',
        'images/1001648950.png',
        'images/1001648951.png',
        'images/1001656365.jpg',
        'images/1001671617.jpg',
        'images/1001675284.png',
        'images/1001675285.png',
        'images/1001675302.png',
        'images/1001675303.png',
        'images/1001677539.jpg',
        'images/1001677540.jpg',
        'images/1001677541.jpg'
    ];
    images.forEach(img => {
        const option = document.createElement('option');
        option.value = img;
        option.textContent = img.replace('images/', '');
        productImageInput.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    populateImageDropdown();
    renderizarProductos();
    
    // Toggle de tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});