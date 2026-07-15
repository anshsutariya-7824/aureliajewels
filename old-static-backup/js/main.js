/**
 * AURELIA Fine Jewelry - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation logic
  initNavigation();

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize product filtration (if on Collections page)
  initCollectionsFilter();

  // Initialize Inquiry Modals & Contact Form Success popup
  initFormsAndModals();
});

/**
 * Navigation Bar Scroll Effect & Mobile Menu Menu Toggle
 */
function initNavigation() {
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Active page indicator based on URL
  const currentPath = window.location.pathname;
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  links.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentFile || (currentFile === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Scroll Reveal Animations using Intersection Observer
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }
}

/**
 * Filter Collections Catalog Items
 */
function initCollectionsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length === 0 || productCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle active state on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        // Simple animation trigger
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';

        setTimeout(() => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.classList.remove('hide');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.classList.add('hide');
          }
        }, 300);
      });
    });
  });

  // Check URL params to apply initial filter (e.g. ?filter=rings)
  const urlParams = new URLSearchParams(window.location.search);
  const initialFilter = urlParams.get('filter');
  if (initialFilter) {
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${initialFilter}"]`);
    if (targetBtn) {
      // Small timeout to ensure visual rendering is complete before triggering transition
      setTimeout(() => {
        targetBtn.click();
      }, 100);
    }
  }
}

/**
 * Modal Handling and Contact Forms Validation/Submission
 */
function initFormsAndModals() {
  // Elements for success/inquiry modal (created dynamically or fetched)
  const modalOverlay = document.getElementById('successModal');
  const modalClose = document.querySelector('.modal-close');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  // Helper function to open modal
  const openModal = (title, text) => {
    if (modalOverlay && modalTitle && modalText) {
      modalTitle.innerText = title;
      modalText.innerText = text;
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scrolling
    }
  };

  // Helper function to close modal
  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scrolling
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Handle URL Pre-selects for product details redirects
  const urlParams = new URLSearchParams(window.location.search);
  const targetProduct = urlParams.get('product');
  if (targetProduct && typeof PRODUCTS_DATA !== 'undefined') {
    const productObj = PRODUCTS_DATA.find(p => p.id === targetProduct);
    if (productObj) {
      const interestSelect = document.getElementById('interest');
      const messageTextarea = document.getElementById('message');
      
      if (interestSelect) {
        let mappedValue = '';
        if (productObj.category === 'rings') mappedValue = 'Diamond Rings Sourcing';
        else if (productObj.category === 'necklaces') mappedValue = 'Fine Necklaces Assembly';
        else if (productObj.category === 'bracelets') mappedValue = 'Bangles & Bracelets Sourcing';
        else if (productObj.category === 'earrings') mappedValue = 'Fine Earrings Sourcing';
        
        if (mappedValue) {
          interestSelect.value = mappedValue;
        }
      }
      
      if (messageTextarea) {
        messageTextarea.value = `We represent a registered jewelry business and are interested in contract manufacturing/sourcing for: ${productObj.name} (Spec Ref: ${productObj.id}). Could your team provide standard casting estimates, metal alloy samples, and sample prototyping timelines?`;
      }
    }
  }

  // Handle Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const company = document.getElementById('company').value;
      const volume = document.getElementById('volume').value;
      const interest = document.getElementById('interest').value;
      const message = document.getElementById('message').value;

      if (!name || !email || !company || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      openModal(
        'Inquiry Submitted',
        `Thank you, ${name}. We have received your wholesale request for ${interest || 'manufacturing catalog'}. A corporate account manager from AURELIA will contact you at ${email} within 24 hours with our factory pricing sheet and catalogue.`
      );
      contactForm.reset();
    });
  }

  // Handle Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        openModal(
          'Subscription Confirmed',
          'Welcome to the world of AURELIA. You will now receive private access to new collections, exclusive boutiques events, and bespoke content.'
        );
        newsletterForm.reset();
      }
    });
  }

  // Handle Product Inquiry button clicks (redirects to WhatsApp with custom message)
  const inquireButtons = document.querySelectorAll('.product-inquire-btn');
  inquireButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product');
      const whatsappNumber = '919427059390'; // User requested number
      const customMessage = encodeURIComponent(`Hi Aurelia Exports, I am looking to request a manufacturing quote for bulk orders of ${productName}. Could you please share catalog specifications and FOB pricing?`);
      
      // Open WhatsApp in a new tab
      window.open(`https://wa.me/${whatsappNumber}?text=${customMessage}`, '_blank');
    });
  } );
}
