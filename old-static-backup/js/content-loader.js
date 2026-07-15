/**
 * AURELIA Jewelry Exports - Dynamic Content Loader
 * Automatically binds elements marked with [data-edit-key] to values inside SITE_CONTENT.
 * Also handles dynamic generation of pillars, timeline history, contact cards, and featured home grids.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof SITE_CONTENT === 'undefined') {
    console.warn('SITE_CONTENT is not defined. Using static markup values.');
    return;
  }

  // Load static key bindings
  loadKeyBindings();

  // Run dynamic page-specific builders
  initDynamicGrids();
});

/**
 * Resolves a nested path in an object (e.g. "home.hero.title")
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj);
}

/**
 * Updates DOM elements containing [data-edit-key]
 */
function loadKeyBindings() {
  const editableElements = document.querySelectorAll('[data-edit-key]');
  
  editableElements.forEach(el => {
    const key = el.getAttribute('data-edit-key');
    const value = getNestedValue(SITE_CONTENT, key);
    
    if (value === undefined) return;

    if (el.tagName.toLowerCase() === 'img') {
      el.src = value;
    } else if (el.tagName.toLowerCase() === 'a') {
      if (key.includes('email')) {
        el.href = `mailto:${value}`;
        // If content is just the email, update text too
        if (el.textContent.includes('@') || el.textContent.trim() === '') {
          el.textContent = value;
        }
      } else if (key.includes('phone')) {
        el.href = `tel:${value.replace(/[^+\d]/g, '')}`;
        if (el.textContent.includes('+') || el.textContent.trim() === '') {
          el.textContent = value;
        }
      } else {
        el.href = value;
      }
    } else {
      // Use innerHTML to preserve basic formatting tags like <br> or <span> if present
      el.innerHTML = value;
    }
  });
}

/**
 * Directs rendering of complex dynamic lists (Pillars, Milestones, Featured Items)
 */
function initDynamicGrids() {
  // 1. Home Page: Brand Pillars
  const pillarsGrid = document.getElementById('brandPillarsGrid');
  if (pillarsGrid && SITE_CONTENT.home && SITE_CONTENT.home.pillars) {
    pillarsGrid.innerHTML = SITE_CONTENT.home.pillars.map((p, idx) => `
      <div class="pillar-card reveal active" style="opacity: 1; transform: translateY(0);">
        <div class="pillar-icon"><i class="${p.icon}"></i></div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    `).join('');
  }

  // 2. Home Page: Featured Diamonds (Limit 3)
  const homeDiamondsGrid = document.getElementById('homeDiamondsGrid');
  if (homeDiamondsGrid && typeof DIAMONDS_DATA !== 'undefined') {
    // Get first 3 featured diamonds (or first 3 if none explicitly featured)
    let featured = DIAMONDS_DATA.filter(d => d.isFeatured);
    if (featured.length === 0) featured = DIAMONDS_DATA.slice(0, 3);
    else featured = featured.slice(0, 3);

    homeDiamondsGrid.innerHTML = featured.map(d => {
      const badgeNew = d.isNew ? `<span class="badge-new">New</span>` : "";
      const badgeFeatured = d.isFeatured ? `<span class="badge-featured">Featured</span>` : "";
      return `
        <div class="diamond-card reveal active" style="opacity: 1; transform: translateY(0);">
          <a href="diamond-detail.html?id=${d.id}" style="display: block; color: inherit;">
            <div class="diamond-img-holder">
              <div class="badge-wrapper">
                ${badgeNew}
                ${badgeFeatured}
              </div>
              <img src="${d.image}" alt="${d.name}">
            </div>
            <div class="diamond-info">
              <h3>${d.name}</h3>
              <p class="diamond-specs">${d.carat} ct<span>&bull;</span>${d.cut}<span>&bull;</span>${d.clarity}<span>&bull;</span>${d.color}</p>
            </div>
          </a>
        </div>
      `;
    }).join('');
  }

  // 3. Home Page: Featured Products (Limit 4)
  const homeProductsGrid = document.getElementById('homeProductsGrid');
  if (homeProductsGrid && typeof PRODUCTS_DATA !== 'undefined') {
    // Get first 4 products
    const featured = PRODUCTS_DATA.slice(0, 4);
    homeProductsGrid.innerHTML = featured.map(item => `
      <div class="product-card reveal active" data-category="${item.category}" style="opacity: 1; transform: translateY(0);">
        <a href="product.html?id=${item.id}" class="product-card-link">
          <div class="product-img-holder">
            <span class="product-badge">MOQ: ${item.moq.split(' ')[0]}</span>
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="product-info">
            <span class="product-category">${item.category.toUpperCase()}</span>
            <h3>${item.name}</h3>
            <div class="product-specs">
              <div class="product-spec-item"><span>Metal</span> <span>${item.alloys.split(',')[0]}</span></div>
              <div class="product-spec-item"><span>Gemstone</span> <span>${item.gemstones.split(',')[0]}</span></div>
              <div class="product-spec-item"><span>Lead Time</span> <span>${item.leadTime}</span></div>
            </div>
          </div>
        </a>
        <div class="product-footer">
          <a href="product.html?id=${item.id}" class="product-price">View Details &rarr;</a>
          <span class="product-inquire-btn" data-product="${item.name}">Inquire &rarr;</span>
        </div>
      </div>
    `).join('');

    // Re-bind inquire buttons
    homeProductsGrid.querySelectorAll('.product-inquire-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = btn.getAttribute('data-product');
        const whatsappNumber = '919427059390';
        const customMessage = encodeURIComponent(`Hi Aurelia, I'd like a quote for ${productName}. Could you share specifications and pricing?`);
        window.open(`https://wa.me/${whatsappNumber}?text=${customMessage}`, '_blank');
      });
    });
  }

  // 4. Collections Page: Dynamically render products catalog
  const catalogGrid = document.getElementById('catalogProductsGrid');
  if (catalogGrid && typeof PRODUCTS_DATA !== 'undefined') {
    renderCollectionsCatalog(PRODUCTS_DATA);
  }

  // 5. About Page: History Timeline Milestones
  const milestonesGrid = document.getElementById('aboutMilestonesGrid');
  if (milestonesGrid && SITE_CONTENT.about && SITE_CONTENT.about.history && SITE_CONTENT.about.history.milestones) {
    milestonesGrid.innerHTML = SITE_CONTENT.about.history.milestones.map((m, idx) => `
      <div class="step-card reveal active" style="opacity: 1; transform: translateY(0);">
        <div class="step-number">${m.year}</div>
        <div class="step-content">
          <h3>${m.title}</h3>
          <p>${m.description}</p>
        </div>
      </div>
    `).join('');
  }

  // 6. Contact Page: Showroom Hours Table
  const hoursTable = document.getElementById('showroomHoursTable');
  if (hoursTable && SITE_CONTENT.contact && SITE_CONTENT.contact.info && SITE_CONTENT.contact.info.hours) {
    hoursTable.innerHTML = SITE_CONTENT.contact.info.hours.map(h => `
      <tr>
        <td>${h.days}</td>
        <td>${h.time}</td>
      </tr>
    `).join('');
  }
}

/**
 * Renders the products grid on collections.html dynamically
 */
function renderCollectionsCatalog(products) {
  const catalogGrid = document.getElementById('catalogProductsGrid');
  if (!catalogGrid) return;

  if (products.length === 0) {
    catalogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
        <i class="fa-regular fa-gem" style="font-size: 3rem; color: var(--color-gold); margin-bottom: 1.5rem; display: block;"></i>
        <h3>No Products Found</h3>
        <p>There are currently no products matching this category in our database.</p>
      </div>
    `;
    return;
  }

  catalogGrid.innerHTML = products.map(item => `
    <div class="product-card" data-category="${item.category}">
      <a href="product.html?id=${item.id}" class="product-card-link">
        <div class="product-img-holder">
          <span class="product-badge">MOQ: ${item.moq.split(' ')[0]}</span>
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="product-info">
          <span class="product-category">${item.category.toUpperCase()}</span>
          <h3>${item.name}</h3>
          <div class="product-specs">
            <div class="product-spec-item"><span>Metal</span> <span>${item.alloys.split(',')[0]}</span></div>
            <div class="product-spec-item"><span>Gemstone</span> <span>${item.gemstones.split(',')[0]}</span></div>
            <div class="product-spec-item"><span>Lead Time</span> <span>${item.leadTime}</span></div>
          </div>
        </div>
      </a>
      <div class="product-footer">
        <a href="product.html?id=${item.id}" class="product-price">View Details &rarr;</a>
        <span class="product-inquire-btn" data-product="${item.name}">Inquire &rarr;</span>
      </div>
    </div>
  `).join('');

  // Re-bind inquire buttons
  catalogGrid.querySelectorAll('.product-inquire-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product');
      const whatsappNumber = '919427059390';
      const customMessage = encodeURIComponent(`Hi Aurelia, I'd like a quote for ${productName}. Could you share specifications and pricing?`);
      window.open(`https://wa.me/${whatsappNumber}?text=${customMessage}`, '_blank');
    });
  });

  // Reinitialize product filtration logic
  if (typeof initCollectionsFilter === 'function') {
    initCollectionsFilter();
  }
}
