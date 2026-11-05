export function verificarSesionDashboard() {
  const rawSession = localStorage.getItem('sigecom_logged_user') || sessionStorage.getItem('sigecom_logged_user');
  if (!rawSession) {
    window.location.href = 'index.html';
    return null;
  }

  let currentUsername = 'Administrador';
  try {
    const sessionData = JSON.parse(rawSession);
    const userNameElement = document.getElementById('sidebar-user-name');
    const userInitialsElement = document.getElementById('user-initials');
    
    if (sessionData.username) {
      currentUsername = sessionData.username;
      if (userNameElement) userNameElement.textContent = currentUsername;
      if (userInitialsElement) userInitialsElement.textContent = currentUsername.substring(0, 2).toUpperCase();
    }
  } catch (err) {
    console.error('Error al procesar sesión:', err);
  }
  return currentUsername;
}

export function initLogout() {
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('sigecom_logged_user');
      sessionStorage.removeItem('sigecom_logged_user');
      window.location.href = 'index.html';
    });
  }
}