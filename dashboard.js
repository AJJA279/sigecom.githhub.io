// dashboard.js
import { verificarSesionDashboard, initLogout } from './auth.js';
import { renderAlertasUI } from './compras_ventas.js';
import { updateReportesUI } from './reportes.js';
import { initDetalleModal } from './modales.js';
import { initExactModalSystem } from './modals_handler.js';
import { 
  cargarProductosDesdeSupabase, 
  cargarProveedoresDesdeSupabase, 
  cargarClientesDesdeSupabase,
  cargarComprasDesdeSupabase,
  cargarVentasDesdeSupabase
} from './productos.js';

document.addEventListener('DOMContentLoaded', () => {
  const currentUsername = verificarSesionDashboard();
  if (!currentUsername) return;

  initLogout();
  initSidebarNavigation();
  initAlertsDropdown();
  initSearchFilter();
  
  renderAlertasUI();

  initExactModalSystem(currentUsername);
  initDetalleModal();
  updateReportesUI();

  // Restaurar la última sección activa si existe en sessionStorage
  const savedSectionId = sessionStorage.getItem('preferredSection');
  if (savedSectionId) {
    const targetSection = document.getElementById(savedSectionId);
    if (targetSection) {
      document.querySelectorAll('.sidebar-nav .nav-item').forEach(l => {
        if (l.getAttribute('data-target') === savedSectionId) l.classList.add('active');
        else l.classList.remove('active');
      });
      document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
      targetSection.classList.add('active');
    }
    sessionStorage.removeItem('preferredSection');
  }

  // Carga principal y directa desde la base de datos de Supabase
  cargarClientesDesdeSupabase();
  cargarProveedoresDesdeSupabase();
  cargarProductosDesdeSupabase();
  cargarComprasDesdeSupabase();
  cargarVentasDesdeSupabase();
});

function initSidebarNavigation() {
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
  const sections = document.querySelectorAll('.dashboard-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-target');
      if (!targetId) return;
      e.preventDefault();

      navLinks.forEach(nav => nav.classList.remove('active'));
      link.classList.add('active');

      sections.forEach(section => section.classList.remove('active'));
      const activeSection = document.getElementById(targetId);
      if (activeSection) activeSection.classList.add('active');

      if (targetId === 'reportes') updateReportesUI();
    });
  });
}

function initAlertsDropdown() {
  const alertBtn = document.getElementById('btn-alerts');
  const alertDropdown = document.getElementById('alerts-dropdown');
  if (alertBtn && alertDropdown) {
    alertBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      alertDropdown.style.display = alertDropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
      if (!alertDropdown.contains(e.target) && !alertBtn.contains(e.target)) alertDropdown.style.display = 'none';
    });
  }
}

function initSearchFilter() {
  const searchInput = document.getElementById('global-search-input');
  if (!searchInput) return;
  searchInput.addEventListener('keyup', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const activeSection = document.querySelector('.dashboard-section.active');
    if (!activeSection) return;
    activeSection.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
  });
}