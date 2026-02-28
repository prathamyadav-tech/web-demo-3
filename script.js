/**
 * Riddima Mobile & Electronic Shop
 * Interactive functionality with backend integration
 */

// API base URL - uses current origin when served from Node server
const API_BASE = window.location.origin;

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initNavbarScroll();
    initSmoothScroll();
    initForms();
    initSearch();
    initWhatsAppOrderButtons();
});

// Mobile menu toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// Navbar background on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initWhatsAppOrderButtons() {
    const phoneNumber = '919302275491';

    document.querySelectorAll('.product-card').forEach(card => {
        const btn = card.querySelector('.btn-whatsapp');
        if (!btn) return;

        const name = card.querySelector('h3')?.textContent?.trim() || 'Product';
        const priceText = card.querySelector('.price')?.textContent?.replace(/\s+/g, ' ')?.trim() || '';

        const message = `Hello, I want to order: ${name}${priceText ? ` (${priceText})` : ''}. Please share availability and final price.`;        
        btn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    });
}

// Form handling with backend API
function initForms() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            const email = input?.value;

            if (email) {
                showNotification('Thanks for subscribing! Check your email for 10% off.', 'success');
                input.value = '';
            }
        });
    }

    // Contact form - submit to backend
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('contactSubmitBtn');
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const response = await fetch(`${API_BASE}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showNotification(result.message || 'Message sent! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showNotification(result.error || 'Failed to send message. Please try again.', 'error');
                }
            } catch (err) {
                console.error('Contact form error:', err);
                showNotification('Unable to connect. Make sure the server is running (npm start).', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchToggle = document.querySelector('.search-toggle');
    const searchWrapper = document.querySelector('.search-wrapper');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchResults = document.getElementById('searchResults');
    const productCards = document.querySelectorAll('.product-card');
    const productsGrid = document.getElementById('productsGrid');

    if (!searchInput || !searchToggle) return;

    // Toggle search input visibility
    searchToggle.addEventListener('click', () => {
        searchWrapper.classList.toggle('active');
        if (searchWrapper.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            filterProducts('');
            hideSearchOverlay();
        }
    });

    // Filter products on input (frontend - works without server)
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        filterProducts(query);

        // Also try API search for dropdown results (when server is running)
        if (query.length >= 2) {
            fetchSearchResults(query);
        } else {
            hideSearchOverlay();
        }
    });

    // Filter products by search query
    function filterProducts(query) {
        if (!query) {
            productCards.forEach(card => {
                card.style.display = '';
            });
            if (productsGrid) {
                const noResults = productsGrid.querySelector('.no-search-results');
                if (noResults) noResults.remove();
            }
            return;
        }

        let hasResults = false;
        productCards.forEach(card => {
            const searchText = (card.getAttribute('data-search') || '').toLowerCase();
            const matches = searchText.includes(query);
            card.style.display = matches ? '' : 'none';
            if (matches) hasResults = true;
        });

        // Show "no results" message
        if (productsGrid) {
            let noResults = productsGrid.querySelector('.no-search-results');
            if (!hasResults) {
                if (!noResults) {
                    noResults = document.createElement('p');
                    noResults.className = 'no-search-results';
                    noResults.textContent = 'No products found. Try different keywords.';
                    noResults.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);';
                    productsGrid.appendChild(noResults);
                }
            } else if (noResults) {
                noResults.remove();
            }
        }
    }

    // Fetch search results from API (for overlay dropdown)
    async function fetchSearchResults(query) {
        try {
            const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.success && data.products) {
                showSearchOverlay(data.products, query);
            }
        } catch {
            // Server not running - frontend filtering already works
        }
    }

    function showSearchOverlay(products, query) {
        if (!searchOverlay || !searchResults) return;
        if (products.length === 0) {
            searchResults.innerHTML = '<p class="search-empty">No products found for "' + query + '"</p>';
        } else {
            searchResults.innerHTML = products.map(p => `
                <a href="#products" class="search-result-item">
                    <strong>${escapeHtml(p.name)}</strong>
                    <span>${escapeHtml(p.category)} - ${escapeHtml(p.price)}</span>
                </a>
            `).join('');

            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    searchWrapper.classList.remove('active');
                    searchInput.value = '';
                    hideSearchOverlay();
                });
            });
        }
        searchOverlay.classList.add('active');
    }

    function hideSearchOverlay() {
        if (searchOverlay) searchOverlay.classList.remove('active');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (searchWrapper && !searchWrapper.contains(e.target) && !searchOverlay?.contains(e.target)) {
            searchWrapper.classList.remove('active');
            hideSearchOverlay();
        }
    });

    // Scroll to products when searching
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Simple notification toast
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `notification-toast notification-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#dc2626' : '#1e293b'};
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        color: white;
        font-size: 0.95rem;
        z-index: 9999;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        animation: slideUp 0.3s ease;
    `;

    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @keyframes slideUp {
                from { opacity: 0; transform: translate(-50%, 20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
        </style>
    `);

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
