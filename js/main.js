var swiperCategories = new Swiper('.categories__container', {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1400: {
      slidesPerView: 6,
      spaceBetween: 24,
    },
  },
});

/*products tabs*/
const tabs = document.querySelectorAll('[data-target]'),
  tabContents = document.querySelectorAll('[content]');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.target);
    console.log(target);
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove('active-tab');
    });

    target.classList.add('active-tab');

    tabs.forEach((t) => {
      t.classList.remove('active-tab');
    });
    tab.classList.add('active-tab');
  });
});

/*=============== LOGIN & REGISTER ===============*/

/* ---- Tab switching ---- */
const authTabs = document.querySelectorAll('.auth__tab'),
  authForms = document.querySelectorAll('.auth__form'),
  authSwitchBtns = document.querySelectorAll('.auth__switch-btn');

const switchAuthTab = (target) => {
  authTabs.forEach(t => t.classList.remove('active-auth-tab'));
  authForms.forEach(f => f.classList.remove('active-auth-form'));

  const activeTab = document.querySelector(`.auth__tab[data-auth="${target}"]`);
  const activeForm = document.getElementById(`${target}-form`);

  if (activeTab) activeTab.classList.add('active-auth-tab');
  if (activeForm) activeForm.classList.add('active-auth-form');
};

authTabs.forEach(tab => {
  tab.addEventListener('click', () => switchAuthTab(tab.dataset.auth));
});

authSwitchBtns.forEach(btn => {
  btn.addEventListener('click', () => switchAuthTab(btn.dataset.auth));
});

/* ---- Toggle password visibility ---- */
const togglePassBtns = document.querySelectorAll('.form__toggle-pass');

togglePassBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const wrapper = btn.closest('.form__input-wrapper');
    const input = wrapper.querySelector('input');
    const icon = btn.querySelector('i');

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fi-rr-eye', 'fi-rr-eye-crossed');
    } else {
      input.type = 'password';
      icon.classList.replace('fi-rr-eye-crossed', 'fi-rr-eye');
    }
  });
});

/* ---- Password strength checker ---- */
const regPassword = document.getElementById('reg-password');
const strengthFill = document.getElementById('strength-fill');
const strengthLabel = document.getElementById('strength-label');

if (regPassword) {
  regPassword.addEventListener('input', () => {
    const val = regPassword.value;
    let score = 0;

    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { label: '', color: '', width: '0%' },
      { label: 'Weak', color: 'hsl(0, 80%, 60%)', width: '25%' },
      { label: 'Fair', color: 'hsl(34, 94%, 55%)', width: '50%' },
      { label: 'Good', color: 'hsl(50, 90%, 50%)', width: '75%' },
      { label: 'Strong', color: 'hsl(155, 70%, 40%)', width: '100%' },
    ];

    const level = val.length === 0 ? levels[0] : levels[score];
    strengthFill.style.width = level.width;
    strengthFill.style.backgroundColor = level.color;
    strengthLabel.textContent = level.label;
    strengthLabel.style.color = level.color;
  });
}

/* ---- Toast helper ---- */
const authToast = document.getElementById('auth-toast');
const toastMsg = document.getElementById('toast-msg');

const showToast = (message) => {
  if (!authToast) return;
  toastMsg.textContent = message;
  authToast.classList.add('show-toast');
  setTimeout(() => authToast.classList.remove('show-toast'), 3500);
};

/* ---- Validation helpers ---- */
const setError = (fieldId, message) => {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (field) field.classList.add('input-error');
  if (field) field.classList.remove('input-success');
  if (error) error.textContent = message;
};

const setSuccess = (fieldId) => {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (field) field.classList.remove('input-error');
  if (field) field.classList.add('input-success');
  if (error) error.textContent = '';
};

const clearValidation = (fieldId) => {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (field) { field.classList.remove('input-error', 'input-success'); }
  if (error) error.textContent = '';
};

/* ---- Login & Register with LocalStorage ---- */

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('users')) || [];
  } catch {
    return [];
  }
}

function saveUser(userObj) {
  const users = getUsers();
  users.push(userObj);
  localStorage.setItem('users', JSON.stringify(users));
}

const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    let valid = true;

    if (!email.value.trim()) {
      setError('login-email', 'Email is required.');
      valid = false;
    } else {
      setSuccess('login-email');
    }

    if (!password.value) {
      setError('login-password', 'Password is required.');
      valid = false;
    } else {
      setSuccess('login-password');
    }

    if (!valid) return;

    const users = getUsers();
    const user = users.find(u => u.email === email.value.trim() && u.password === password.value);

    if (user) {
      const sessionUser = { ...user };
      delete sessionUser.password;
      localStorage.setItem('currentUser', JSON.stringify(sessionUser));
      loginBtn.textContent = 'Signing in...';
      loginBtn.disabled = true;

      setTimeout(() => {
        loginBtn.textContent = 'Sign In';
        loginBtn.disabled = false;
        showToast('✅ Autentificare realizată cu succes!');
        setTimeout(() => window.location.href = 'index.html', 1000);
      }, 1000);
    } else {
      setError('login-password', 'Email sau parolă incorectă!');
      showToast('Autentificare eșuată.');
    }
  });
}

const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
  registerBtn.addEventListener('click', () => {
    const firstname = document.getElementById('reg-firstname');
    const lastname = document.getElementById('reg-lastname');
    const email = document.getElementById('reg-email');
    const phone = document.getElementById('reg-phone');
    const password = document.getElementById('reg-password');
    const confirmPassword = document.getElementById('reg-confirm-password');
    const agreeTerms = document.getElementById('agree-terms');
    const termsError = document.getElementById('reg-terms-error');
    let valid = true;

    if (!firstname.value.trim()) {
      setError('reg-firstname', 'First name is required.');
      valid = false;
    } else {
      setSuccess('reg-firstname');
    }

    if (!lastname.value.trim()) {
      setError('reg-lastname', 'Last name is required.');
      valid = false;
    } else {
      setSuccess('reg-lastname');
    }

    if (!email.value.trim()) {
      setError('reg-email', 'Email is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError('reg-email', 'Adresă de email invalidă.');
      valid = false;
    } else {
      setSuccess('reg-email');
    }

    if (phone && !phone.value.trim()) {
      setError('reg-phone', 'Phone is required.');
      valid = false;
    } else if (phone && !/^[0-9]+$/.test(phone.value.trim())) {
      setError('reg-phone', 'Doar cifre permise.');
      valid = false;
    } else if (phone) {
      setSuccess('reg-phone');
    }

    if (!password.value) {
      setError('reg-password', 'Password is required.');
      valid = false;
    } else if (password.value.length < 8) {
      setError('reg-password', 'Min. 8 characters.');
      valid = false;
    } else {
      setSuccess('reg-password');
    }

    if (!confirmPassword.value) {
      setError('reg-confirm-password', 'Please confirm password.');
      valid = false;
    } else if (confirmPassword.value !== password.value) {
      setError('reg-confirm-password', 'Passwords do not match.');
      valid = false;
    } else {
      setSuccess('reg-confirm-password');
    }

    if (!agreeTerms.checked) {
      if (termsError) termsError.textContent = 'You must agree to the Terms & Conditions.';
      valid = false;
    } else {
      if (termsError) termsError.textContent = '';
    }

    if (!valid) return;

    const users = getUsers();
    if (users.find(u => u.email === email.value.trim())) {
      setError('reg-email', 'Email is already registered!');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      firstName: firstname.value.trim(),
      lastName: lastname.value.trim(),
      email: email.value.trim(),
      phone: phone ? phone.value.trim() : '',
      password: password.value
    };

    saveUser(newUser);

    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(err => console.error('Eroare la salvarea pe server:', err));

    // Generăm și descărcăm fișierul cu datele contului
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newUser, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `date_cont_${newUser.firstName}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    registerBtn.textContent = 'Creating account...';
    registerBtn.disabled = true;

    setTimeout(() => {
      registerBtn.textContent = 'Create Account';
      registerBtn.disabled = false;
      showToast('✅ Cont creat cu succes! Te poți loga acum.');

      ['reg-firstname', 'reg-lastname', 'reg-email', 'reg-phone', 'reg-password', 'reg-confirm-password'].forEach(id => {
        if (document.getElementById(id)) {
          clearValidation(id);
          document.getElementById(id).value = '';
        }
      });
      agreeTerms.checked = false;
      if (strengthFill) { strengthFill.style.width = '0%'; }
      if (strengthLabel) { strengthLabel.textContent = ''; }

      setTimeout(() => switchAuthTab('login'), 1500);
    }, 1000);
  });
}

/* ---- Real-time input clearing of errors ---- */
['login-email', 'login-password', 'reg-firstname', 'reg-lastname',
  'reg-email', 'reg-password', 'reg-confirm-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('input-error');
        const err = document.getElementById(`${id}-error`);
        if (err) err.textContent = '';
      });
    }
  });

/*=============== SHOP ===============*/

/* ---- Sidebar toggle (mobile) ---- */
const filterToggleBtn = document.getElementById('filter-toggle-btn');
const shopSidebar = document.getElementById('shop-sidebar');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarOverlay = document.getElementById('sidebar-overlay');

const openSidebar = () => {
  if (!shopSidebar) return;
  shopSidebar.classList.add('show-sidebar');
  sidebarOverlay.classList.add('show-overlay');
  document.body.style.overflow = 'hidden';
};

const closeSidebar = () => {
  if (!shopSidebar) return;
  shopSidebar.classList.remove('show-sidebar');
  sidebarOverlay.classList.remove('show-overlay');
  document.body.style.overflow = '';
};

if (filterToggleBtn) filterToggleBtn.addEventListener('click', openSidebar);
if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

/* ---- Filter Logic ---- */
const priceSlider = document.getElementById('price-slider');
const priceMax = document.getElementById('price-max');
const priceMin = document.getElementById('price-min');
const resultsCount = document.getElementById('results-count');

const applyFilters = () => {
  const shopProducts = document.getElementById('shop-products');
  if (!shopProducts) return;

  const items = Array.from(shopProducts.querySelectorAll('.product__item'));

  const checkedCategories = Array.from(
    document.querySelectorAll('.filter__checkbox:checked')
  ).map(cb => cb.value);

  const maxPrice = priceMax ? parseFloat(priceMax.value) : 500;
  const minPrice = priceMin ? parseFloat(priceMin.value) : 0;

  let visible = 0;

  items.forEach(item => {
    const categoryEl = item.querySelector('.product__category');
    const priceEl = item.querySelector('.new__price');

    const itemCategory = categoryEl ? categoryEl.textContent.trim().toLowerCase() : '';
    const itemPrice = priceEl ? parseFloat(priceEl.textContent.replace('$', '')) : 0;

    const categoryMatch =
      checkedCategories.includes('all') ||
      checkedCategories.length === 0 ||
      checkedCategories.includes(itemCategory);

    const priceMatch = itemPrice >= minPrice && itemPrice <= maxPrice;

    if (categoryMatch && priceMatch) {
      item.style.display = '';
      visible++;
    } else {
      item.style.display = 'none';
    }
  });

  if (resultsCount) resultsCount.textContent = visible;
};

/* ---- Price Range Slider ---- */
if (priceSlider) {
  const updateSliderTrack = (val) => {
    const pct = (val / priceSlider.max) * 100;
    priceSlider.style.background = `linear-gradient(to right, var(--first-color) ${pct}%, var(--border-color-alt) ${pct}%)`;
  };

  priceSlider.addEventListener('input', () => {
    priceMax.value = priceSlider.value;
    updateSliderTrack(priceSlider.value);
    applyFilters();
  });

  priceMax.addEventListener('input', () => {
    let val = parseInt(priceMax.value);
    if (val > 500) val = 500;
    if (val < parseInt(priceMin.value)) val = parseInt(priceMin.value);
    priceMax.value = val;
    priceSlider.value = val;
    updateSliderTrack(val);
    applyFilters();
  });

  updateSliderTrack(priceSlider.value);
}

/* ---- Category Checkboxes ---- */
document.querySelectorAll('.filter__checkbox').forEach(cb => {
  cb.addEventListener('change', () => {
    if (cb.value === 'all' && cb.checked) {
      document.querySelectorAll('.filter__checkbox:not([value="all"])').forEach(other => {
        other.checked = false;
      });
    }
    if (cb.value !== 'all' && cb.checked) {
      const allCb = document.querySelector('.filter__checkbox[value="all"]');
      if (allCb) allCb.checked = false;
    }
    applyFilters();
  });
});

/* ---- Sort Select ---- */
const sortSelect = document.getElementById('sort-select');

if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    const shopProducts = document.getElementById('shop-products');
    if (!shopProducts) return;

    const items = Array.from(shopProducts.querySelectorAll('.product__item'));

    const getPrice = (item) => {
      const priceEl = item.querySelector('.new__price');
      return priceEl ? parseFloat(priceEl.textContent.replace('$', '')) : 0;
    };

    const getName = (item) => {
      const titleEl = item.querySelector('.product__title');
      return titleEl ? titleEl.textContent.trim().toLowerCase() : '';
    };

    items.sort((a, b) => {
      switch (sortSelect.value) {
        case 'price-asc': return getPrice(a) - getPrice(b);
        case 'price-desc': return getPrice(b) - getPrice(a);
        case 'name-asc': return getName(a).localeCompare(getName(b));
        case 'name-desc': return getName(b).localeCompare(getName(a));
        default: return 0;
      }
    });

    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      shopProducts.appendChild(item);
      setTimeout(() => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, i * 50);
    });
  });
}

/* ---- Reset Filters ---- */
const filterReset = document.getElementById('filter-reset');

if (filterReset) {
  filterReset.addEventListener('click', () => {
    document.querySelectorAll('.filter__checkbox').forEach(cb => {
      cb.checked = cb.value === 'all';
    });

    if (priceSlider) {
      priceSlider.value = 500;
      if (priceMax) priceMax.value = 500;
      if (priceMin) priceMin.value = 0;
      priceSlider.style.background = `linear-gradient(to right, var(--first-color) 100%, var(--border-color-alt) 100%)`;
    }

    if (sortSelect) sortSelect.value = 'default';

    applyFilters();
  });
}

/* ============================================================
   DYNAMIC PRODUCTS LOAD (JSON)
============================================================ */
async function loadProductsGlobal() {
  try {
    const res = await fetch('./products.json');
    if (!res.ok) throw new Error('File not found');
    const products = await res.json();

    const grid = document.getElementById('auth-products-grid');
    if (grid) {
      grid.innerHTML = products.map(item => `
        <div style="border: 1px solid var(--border-color-alt); border-radius: 1rem; overflow: hidden; background: var(--body-color); display: flex; flex-direction: column;">
          <div style="position: relative; aspect-ratio: 1; overflow: hidden; background: var(--container-color);">
            <img src="${item.image}" alt="" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='', this.style.background='var(--container-color)'">
          </div>
          <div style="padding: 1rem 1.25rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
            <span style="font-size: var(--tiny-font-size); color: var(--text-color-light);">${item.category || ''}</span>
            <span style="font-family: var(--second-font); font-size: var(--small-font-size); font-weight: var(--weight-600); color: var(--title-color);">${item.name || ''}</span>
            <span style="color: var(--first-color); font-family: var(--second-font); font-weight: var(--weight-700); font-size: var(--normal-font-size);">$${Number(item.price || 0).toFixed(2)}</span>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadProductsGlobal);