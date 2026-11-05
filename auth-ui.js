// auth-ui.js
const termsCard = document.getElementById('terms-card');
const loginCard = document.getElementById('login-card');
const btnAcceptTerms = document.getElementById('btn-accept-terms');
const btnBackTerms = document.getElementById('btn-back-terms');
const acceptTermsCheck = document.getElementById('accept-terms-check');

const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const rememberCheck = document.getElementById('remember-check');
const loginError = document.getElementById('login-error');

const openTermsModalBtn = document.getElementById('open-terms-modal');
const termsModal = document.getElementById('terms-modal');
const closeTermsModalBtn = document.getElementById('close-terms-modal');
const btnAcceptModal = document.getElementById('btn-accept-modal');

document.addEventListener('DOMContentLoaded', () => {
  const loggedUserPersistent = localStorage.getItem('sigecom_logged_user');
  const loggedUserSession = sessionStorage.getItem('sigecom_logged_user');
  const termsAccepted = localStorage.getItem('sigecom_terms_accepted');

  if (loggedUserPersistent || loggedUserSession) {
    window.location.href = 'dashboard.html';
    return;
  }

  if (termsAccepted === 'true') {
    termsCard.style.display = 'none';
    loginCard.style.display = 'block';
  }
});

if (acceptTermsCheck) {
  acceptTermsCheck.addEventListener('change', () => {
    btnAcceptTerms.disabled = !acceptTermsCheck.checked;
  });
}

if (btnAcceptTerms) {
  btnAcceptTerms.addEventListener('click', () => {
    if (acceptTermsCheck.checked) {
      localStorage.setItem('sigecom_terms_accepted', 'true');
      termsCard.style.display = 'none';
      loginCard.style.display = 'block';
    }
  });
}

if (btnBackTerms) {
  btnBackTerms.addEventListener('click', () => {
    loginCard.style.display = 'none';
    termsCard.style.display = 'block';
    loginError.style.display = 'none';
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginError.style.display = 'none';

    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();
    const keepSession = rememberCheck ? rememberCheck.checked : false;

    if (username !== "" && password !== "") {
      const sessionData = {
        username: username,
        loginTime: new Date().toISOString()
      };

      if (keepSession) {
        localStorage.setItem('sigecom_logged_user', JSON.stringify(sessionData));
        sessionStorage.removeItem('sigecom_logged_user');
      } else {
        sessionStorage.setItem('sigecom_logged_user', JSON.stringify(sessionData));
        localStorage.removeItem('sigecom_logged_user');
      }

      window.location.href = 'dashboard.html';
    } else {
      loginError.style.display = 'flex';
    }
  });
}

if (openTermsModalBtn) {
  openTermsModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    termsModal.style.display = 'flex';
  });
}

if (closeTermsModalBtn) {
  closeTermsModalBtn.addEventListener('click', () => { termsModal.style.display = 'none'; });
}

if (btnAcceptModal) {
  btnAcceptModal.addEventListener('click', () => { termsModal.style.display = 'none'; });
}

window.addEventListener('click', (e) => {
  if (e.target === termsModal) termsModal.style.display = 'none';
});