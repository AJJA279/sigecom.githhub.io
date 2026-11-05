// storage.js
window.proveedorProductosMap = {};
window.alertasSistema = [];

export function saveDataToLocalStorage() {
  const tClientes = document.querySelector('#table-clientes tbody');
  const tProveedores = document.querySelector('#table-proveedores tbody');
  const tProductos = document.querySelector('#table-productos tbody');
  const tCompras = document.querySelector('#table-compras tbody');
  const tVentas = document.querySelector('#table-ventas tbody');
  const tMovimientos = document.querySelector('#table-movimientos tbody');

  if (tClientes) localStorage.setItem('sigecom_clientes', tClientes.innerHTML);
  if (tProveedores) localStorage.setItem('sigecom_proveedores', tProveedores.innerHTML);
  if (tProductos) localStorage.setItem('sigecom_productos', tProductos.innerHTML);
  if (tCompras) localStorage.setItem('sigecom_compras', tCompras.innerHTML);
  if (tVentas) localStorage.setItem('sigecom_ventas', tVentas.innerHTML);
  if (tMovimientos) localStorage.setItem('sigecom_movimientos', tMovimientos.innerHTML);

  localStorage.setItem('sigecom_map', JSON.stringify(window.proveedorProductosMap));
  localStorage.setItem('sigecom_alertas', JSON.stringify(window.alertasSistema));
}

export function loadDataFromLocalStorage(callbackRebind) {
  if (localStorage.getItem('sigecom_clientes')) {
    const c = document.querySelector('#table-clientes tbody');
    const p = document.querySelector('#table-proveedores tbody');
    const pr = document.querySelector('#table-productos tbody');
    const comp = document.querySelector('#table-compras tbody');
    const v = document.querySelector('#table-ventas tbody');
    const m = document.querySelector('#table-movimientos tbody');

    if (c) c.innerHTML = localStorage.getItem('sigecom_clientes');
    if (p) p.innerHTML = localStorage.getItem('sigecom_proveedores');
    if (pr) pr.innerHTML = localStorage.getItem('sigecom_productos');
    if (comp) comp.innerHTML = localStorage.getItem('sigecom_compras');
    if (v) v.innerHTML = localStorage.getItem('sigecom_ventas');
    if (m) m.innerHTML = localStorage.getItem('sigecom_movimientos');
    
    try {
      window.proveedorProductosMap = JSON.parse(localStorage.getItem('sigecom_map')) || {};
      window.alertasSistema = JSON.parse(localStorage.getItem('sigecom_alertas')) || [];
    } catch(e) { 
      window.proveedorProductosMap = {}; 
      window.alertasSistema = [];
    }

    if (typeof callbackRebind === 'function') callbackRebind();
  }
}

export function reindexTableIDs(tableSelector) {
  const rows = document.querySelectorAll(`${tableSelector} tbody tr`);
  rows.forEach((row, index) => {
    const idCell = row.cells[0];
    if (idCell) idCell.textContent = index + 1;
  });
}