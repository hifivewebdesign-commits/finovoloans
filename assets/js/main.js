/**
 * FINOVO LOANS - Official JavaScript
 * Company: Finovoloans
 * Phone: 8807720744 | Email: finovoloans@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initStatsCounter();
  initFaqAccordion();
  initFaqSearchAndFilter();
  initLoanCalculator();
  initModal();
  initLeadForms();
  initScrollTop();
});

/* ==========================================================================
   1. NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
}

/* ==========================================================================
   2. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target) || 0;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 2000; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeProgress * target);

          el.textContent = `${prefix}${current}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, {
    threshold: 0.3
  });

  statNumbers.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      const parentList = item.closest('.accordion-list');
      if (parentList) {
        parentList.querySelectorAll('.accordion-item').forEach(sibling => {
          if (sibling !== item && sibling.classList.contains('active')) {
            sibling.classList.remove('active');
            const siblingBody = sibling.querySelector('.accordion-body');
            if (siblingBody) siblingBody.style.maxHeight = null;
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Global expand all / collapse all button
  const expandAllBtn = document.getElementById('expandAllFaqs');
  if (expandAllBtn) {
    let allExpanded = false;
    expandAllBtn.addEventListener('click', () => {
      const items = document.querySelectorAll('.accordion-item');
      allExpanded = !allExpanded;

      items.forEach(item => {
        if (item.offsetParent !== null) {
          const body = item.querySelector('.accordion-body');
          if (allExpanded) {
            item.classList.add('active');
            if (body) body.style.maxHeight = body.scrollHeight + 'px';
          } else {
            item.classList.remove('active');
            if (body) body.style.maxHeight = null;
          }
        }
      });

      expandAllBtn.innerHTML = allExpanded 
        ? '<i class="fa-solid fa-compress"></i> Collapse All' 
        : '<i class="fa-solid fa-expand"></i> Expand All';
    });
  }
}

/* ==========================================================================
   5. FAQ LIVE SEARCH AND CATEGORY FILTERING
   ========================================================================== */
function initFaqSearchAndFilter() {
  const filterBtns = document.querySelectorAll('.faq-filter-btn');
  const searchInput = document.getElementById('faqSearchInput');
  const clearBtn = document.getElementById('clearSearch');
  const countDisplay = document.getElementById('faqCountDisplay');
  const categoryBlocks = document.querySelectorAll('.faq-category-block');
  const accordionItems = document.querySelectorAll('.accordion-item');

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    accordionItems.forEach(item => {
      const itemCategory = item.dataset.category || '';
      const questionText = item.querySelector('.accordion-header h4')?.textContent.toLowerCase() || '';
      const answerText = item.querySelector('.accordion-content')?.textContent.toLowerCase() || '';

      const matchesCategory = (currentCategory === 'all' || itemCategory === currentCategory);
      const matchesSearch = !searchQuery || questionText.includes(searchQuery) || answerText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        item.style.display = 'block';
        visibleCount++;
        if (searchQuery.length > 2) {
          item.classList.add('active');
          const body = item.querySelector('.accordion-body');
          if (body) body.style.maxHeight = body.scrollHeight + 'px';
        }
      } else {
        item.style.display = 'none';
      }
    });

    categoryBlocks.forEach(block => {
      const visibleInBlock = block.querySelectorAll('.accordion-item:not([style*="display: none"])').length;
      if (visibleInBlock === 0) {
        block.style.display = 'none';
      } else {
        block.style.display = 'block';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} Question${visibleCount === 1 ? '' : 's'}`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
      }
      applyFilters();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        applyFilters();
        searchInput.focus();
      });
    }
  }
}

/* ==========================================================================
   6. LOAN EMI CALCULATOR
   ========================================================================== */
function initLoanCalculator() {
  const amountSlider = document.getElementById('calcAmountSlider');
  const amountDisplay = document.getElementById('calcAmountDisplay');

  const tenureSlider = document.getElementById('calcTenureSlider');
  const tenureDisplay = document.getElementById('calcTenureDisplay');

  const rateSlider = document.getElementById('calcRateSlider');
  const rateDisplay = document.getElementById('calcRateDisplay');

  const emiOutput = document.getElementById('calcEmiOutput');
  const principalOutput = document.getElementById('calcPrincipalOutput');
  const interestOutput = document.getElementById('calcInterestOutput');
  const totalOutput = document.getElementById('calcTotalOutput');

  const barPrincipal = document.getElementById('barPrincipal');
  const barInterest = document.getElementById('barInterest');

  if (!amountSlider || !tenureSlider || !rateSlider) return;

  function formatIndianCurrency(num) {
    return '₹' + Math.round(num).toLocaleString('en-IN');
  }

  function calculateEMI() {
    const P = parseFloat(amountSlider.value);
    const annualRate = parseFloat(rateSlider.value);
    const years = parseFloat(tenureSlider.value);

    if (amountDisplay) amountDisplay.textContent = formatIndianCurrency(P);
    if (tenureDisplay) tenureDisplay.textContent = `${years} Year${years > 1 ? 's' : ''} (${years * 12} Mo)`;
    if (rateDisplay) rateDisplay.textContent = `${annualRate}% p.a.`;

    const r = annualRate / 12 / 100;
    const n = years * 12;

    let emi = 0;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    if (emiOutput) emiOutput.textContent = formatIndianCurrency(emi);
    if (principalOutput) principalOutput.textContent = formatIndianCurrency(P);
    if (interestOutput) interestOutput.textContent = formatIndianCurrency(totalInterest);
    if (totalOutput) totalOutput.textContent = formatIndianCurrency(totalPayment);

    const principalPercent = (P / totalPayment) * 100;
    const interestPercent = 100 - principalPercent;

    if (barPrincipal) barPrincipal.style.width = principalPercent + '%';
    if (barInterest) barInterest.style.width = interestPercent + '%';
  }

  amountSlider.addEventListener('input', calculateEMI);
  tenureSlider.addEventListener('input', calculateEMI);
  rateSlider.addEventListener('input', calculateEMI);

  calculateEMI();

  const applyCalcBtn = document.getElementById('applyCalculatedLoanBtn');
  if (applyCalcBtn) {
    applyCalcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentAmount = amountSlider.value;
      const currentEmi = emiOutput?.textContent || '';
      openLoanModal({
        amount: currentAmount,
        notes: `Calculated EMI ~ ${currentEmi} for ${tenureSlider.value} yrs @ ${rateSlider.value}%`
      });
    });
  }
}

/* ==========================================================================
   7. MODAL SYSTEM
   ========================================================================== */
function initModal() {
  const modalOverlay = document.getElementById('enquiryModal');
  const closeBtns = document.querySelectorAll('[data-close-modal]');
  const triggerBtns = document.querySelectorAll('[data-open-modal]');

  window.openLoanModal = function(options = {}) {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (options.loanType) {
      const typeSelect = modalOverlay.querySelector('#modalLoanType');
      if (typeSelect) typeSelect.value = options.loanType;
    }
    if (options.amount) {
      const amountInput = modalOverlay.querySelector('#modalLoanAmount');
      if (amountInput) amountInput.value = options.amount;
    }
  };

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const loanType = btn.dataset.loanType || '';
      window.openLoanModal({ loanType });
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. LEAD GENERATION FORMS (WhatsApp & Direct Connect)
   ========================================================================== */
function initLeadForms() {
  const WHATSAPP_NUMBER = '918807720744';

  const heroForm = document.getElementById('heroEnquiryForm');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = heroForm.querySelector('[name="name"]')?.value || '';
      const phone = heroForm.querySelector('[name="phone"]')?.value || '';
      const loanType = heroForm.querySelector('[name="loan_type"]')?.value || 'Loan Enquiry';
      const amount = heroForm.querySelector('[name="amount"]')?.value || '';
      const city = heroForm.querySelector('[name="city"]')?.value || '';

      const msg = `*Finovo Loans Website Lead*\n` +
                  `👤 *Name:* ${name}\n` +
                  `📱 *Phone:* ${phone}\n` +
                  `🏦 *Loan Type:* ${loanType}\n` +
                  `💰 *Required Amount:* ₹${amount}\n` +
                  `📍 *City:* ${city}\n\n` +
                  `Please contact me regarding my loan eligibility.`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      showSuccessNotice('Thank you! Redirecting to WhatsApp to submit your loan enquiry...');
      heroForm.reset();
    });
  }

  const modalForm = document.getElementById('modalEnquiryForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modalForm.querySelector('[name="name"]')?.value || '';
      const phone = modalForm.querySelector('[name="phone"]')?.value || '';
      const loanType = modalForm.querySelector('[name="loan_type"]')?.value || 'General Loan Enquiry';
      const amount = modalForm.querySelector('[name="amount"]')?.value || '';
      const city = modalForm.querySelector('[name="city"]')?.value || '';
      const message = modalForm.querySelector('[name="message"]')?.value || '';

      const msg = `*Finovo Loans Quick Enquiry*\n` +
                  `👤 *Name:* ${name}\n` +
                  `📱 *Phone:* ${phone}\n` +
                  `🏦 *Service:* ${loanType}\n` +
                  `💰 *Amount:* ₹${amount}\n` +
                  `📍 *City:* ${city}\n` +
                  (message ? `📝 *Notes:* ${message}\n` : '') +
                  `\nPlease assist me with lender options and next steps.`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      showSuccessNotice('Enquiry sent! Our representative will connect with you shortly.');
      modalForm.reset();
      const modal = document.getElementById('enquiryModal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  const partnerForm = document.getElementById('partnerRegForm');
  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = partnerForm.querySelector('[name="name"]')?.value || '';
      const phone = partnerForm.querySelector('[name="phone"]')?.value || '';
      const email = partnerForm.querySelector('[name="email"]')?.value || '';
      const profession = partnerForm.querySelector('[name="profession"]')?.value || 'Partner';
      const city = partnerForm.querySelector('[name="city"]')?.value || '';
      const notes = partnerForm.querySelector('[name="notes"]')?.value || '';

      const msg = `*Finovo Loans Partner Program Registration*\n` +
                  `🤝 *Partner Name:* ${name}\n` +
                  `📱 *Contact Phone:* ${phone}\n` +
                  `📧 *Email:* ${email}\n` +
                  `💼 *Profession:* ${profession}\n` +
                  `📍 *City/Region:* ${city}\n` +
                  (notes ? `📌 *Experience/Network:* ${notes}\n` : '') +
                  `\nI want to join the Finovo Loans Referral Partner Program and earn commissions.`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      showSuccessNotice('Partner application received! Connecting to partner onboarding via WhatsApp.');
      partnerForm.reset();
    });
  }

  const contactForm = document.getElementById('contactPageForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]')?.value || '';
      const phone = contactForm.querySelector('[name="phone"]')?.value || '';
      const email = contactForm.querySelector('[name="email"]')?.value || '';
      const loanType = contactForm.querySelector('[name="loan_type"]')?.value || 'General';
      const msgText = contactForm.querySelector('[name="message"]')?.value || '';

      const msg = `*Finovo Loans Contact Inquiry*\n` +
                  `👤 *Name:* ${name}\n` +
                  `📱 *Phone:* ${phone}\n` +
                  `📧 *Email:* ${email}\n` +
                  `🏦 *Subject:* ${loanType}\n` +
                  `💬 *Message:* ${msgText}`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      showSuccessNotice('Thank you for contacting Finovo Loans! Redirecting to WhatsApp.');
      contactForm.reset();
    });
  }
}

function showSuccessNotice(msg) {
  let toast = document.getElementById('finovoToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'finovoToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(50px);
      background: #112965;
      color: #ffffff;
      padding: 14px 24px;
      border-radius: 9999px;
      font-size: 0.95rem;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 3000;
      opacity: 0;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      border-left: 4px solid #a70861;
      max-width: 90%;
      text-align: center;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> ${msg}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(50px)';
  }, 4500);
}

/* ==========================================================================
   9. SCROLL TO TOP
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
