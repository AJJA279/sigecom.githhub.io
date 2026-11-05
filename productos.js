// productos.js
import { supabase } from './supabase.js';
import { openEditModal } from './modals_handler.js';

// --- FUNCIÓN DE COMPATIBILIDAD (Evita errores si algún módulo la importa) ---
export async function actualizarStockProductos(items, proveedor, operacion) {
  console.log("Stock gestionado manualmente:", { items, proveedor, operacion });
}

// --- LEER CLIENTES ---
export async function cargarClientesDesdeSupabase() {
  const tbody = document.querySelector('#table-clientes tbody');
  if (!tbody) return;

  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("Error al obtener clientes:", error.message);
    return;
  }

  tbody.innerHTML = '';
  clientes.forEach((cli) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', cli.id);
    tr.innerHTML = `
      <td>${cli.id}</td>
      <td>${cli.nombre}</td>
      <td>${cli.tipo || '-'}</td>
      <td>${cli.telefono || '-'}</td>
      <td>${cli.email || '-'}</td>
      <td>${cli.direccion || '-'}</td>
      <td>
        <button type="button" class="row-action-btn btn-edit-cliente">Editar</button>
        <button type="button" class="row-action-btn btn-del-cliente">Eliminar</button>
      </td>
    `;

    tr.querySelector('.btn-edit-cliente').onclick = () => openEditModal('Cliente', tr);
    tr.querySelector('.btn-del-cliente').onclick = async () => {
      if (confirm(`¿Eliminar al cliente ${cli.nombre}?`)) {
        const { error } = await supabase.from('clientes').delete().eq('id', cli.id);
        if (!error) cargarClientesDesdeSupabase();
      }
    };

    tbody.appendChild(tr);
  });
}

// --- LEER PROVEEDORES ---
export async function cargarProveedoresDesdeSupabase() {
  const tbody = document.querySelector('#table-proveedores tbody');
  if (!tbody) return;

  const { data: proveedores, error } = await supabase
    .from('proveedores')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("Error al obtener proveedores:", error.message);
    return;
  }

  tbody.innerHTML = '';
  proveedores.forEach((prov, index) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', prov.id);
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${prov.empresa || '-'}</td>
      <td>${prov.rubro || '-'}</td>
      <td>${prov.telefono || '-'}</td>
      <td>${prov.direccion || '-'}</td>
      <td>${prov.email || '-'}</td>
      <td>${prov.productos || '-'}</td>
      <td>
        <button type="button" class="row-action-btn btn-edit-prov">Editar</button>
        <button type="button" class="row-action-btn btn-del-prov">Eliminar</button>
      </td>
    `;

    tr.querySelector('.btn-edit-prov').onclick = () => openEditModal('Proveedor', tr);
    tr.querySelector('.btn-del-prov').onclick = async () => {
      if (confirm(`¿Eliminar al proveedor ${prov.empresa}?`)) {
        const { error } = await supabase.from('proveedores').delete().eq('id', prov.id);
        if (!error) cargarProveedoresDesdeSupabase();
      }
    };

    tbody.appendChild(tr);
  });
}

// --- LEER PRODUCTOS ---
export async function cargarProductosDesdeSupabase() {
  const tbody = document.querySelector('#table-productos tbody');
  if (!tbody) return;

  const { data: productos, error } = await supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("Error al obtener productos:", error.message);
    return;
  }

  tbody.innerHTML = '';
  productos.forEach((prod) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', prod.id);
    tr.innerHTML = `
      <td>${prod.sku || '-'}</td>
      <td>${prod.nombre}</td>
      <td>${prod.categoria || '-'}</td>
      <td>${prod.stock || 0}</td>
      <td>$${parseFloat(prod.precio_compra || 0).toLocaleString()}</td>
      <td>$${parseFloat(prod.precio_venta || 0).toLocaleString()}</td>
      <td>${prod.proveedor_empresa || 'Sin asignar'}</td>
      <td>
        <button type="button" class="row-action-btn btn-edit-prod">Editar</button>
        <button type="button" class="row-action-btn btn-del-prod">Eliminar</button>
      </td>
    `;

    tr.querySelector('.btn-edit-prod').onclick = () => openEditModal('Producto', tr);
    tr.querySelector('.btn-del-prod').onclick = async () => {
      if (confirm(`¿Eliminar el producto ${prod.nombre}?`)) {
        const { error } = await supabase.from('productos').delete().eq('id', prod.id);
        if (!error) cargarProductosDesdeSupabase();
      }
    };

    tbody.appendChild(tr);
  });
}

// --- LEER COMPRAS ---
export async function cargarComprasDesdeSupabase() {
  const tbody = document.querySelector('#table-compras tbody');
  if (!tbody) return;

  const { data: compras, error } = await supabase
    .from('compras')
    .select('*, proveedores(empresa)')
    .order('id', { ascending: true });

  if (error) {
    console.error("Error al obtener compras:", error.message);
    return;
  }

  tbody.innerHTML = '';
  compras.forEach((compra) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', compra.id);
    
    const detalle = compra.detalle_items || {};
    const comprobanteLink = detalle.comprobante 
      ? `<a href="${detalle.comprobante}" target="_blank" style="color:#2563eb; text-decoration:underline; font-weight:600;">Ver Archivo</a>` 
      : 'Sin comprobante';
    const empresaProv = compra.proveedores?.empresa || 'Proveedor ID: ' + compra.proveedor_id;

    tr.innerHTML = `
      <td>${compra.numero_orden || '-'}</td>
      <td>${empresaProv}</td>
      <td>$${parseFloat(compra.total || 0).toLocaleString()}</td>
      <td><span style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-weight:600; font-size:0.8rem;">${compra.estado || 'Pendiente'}</span></td>
      <td>${comprobanteLink}</td>
      <td>
        <button type="button" class="row-action-btn btn-edit-compra" style="background:#e0f2fe; color:#0369a1; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; margin-right:4px;">Editar</button>
        <button type="button" class="row-action-btn btn-del-compra" style="background:#fee2e2; color:#b91c1c; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Eliminar</button>
      </td>
    `;

    tr.querySelector('.btn-edit-compra').onclick = () => openEditModal('Compra', tr);
    tr.querySelector('.btn-del-compra').onclick = async () => {
      if (confirm(`¿Estás seguro de eliminar la orden ${compra.numero_orden}?`)) {
        const { error } = await supabase.from('compras').delete().eq('id', compra.id);
        if (!error) {
          cargarComprasDesdeSupabase();
        } else {
          alert("Error al eliminar: " + error.message);
        }
      }
    };

    tbody.appendChild(tr);
  });
}

// --- LEER VENTAS ---
export async function cargarVentasDesdeSupabase() {
  const tbody = document.querySelector('#table-ventas tbody');
  if (!tbody) return;

  const { data: ventas, error } = await supabase
    .from('ventas')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("Error al obtener ventas:", error.message);
    return;
  }

  tbody.innerHTML = '';
  ventas.forEach((venta) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', venta.id);
    
    const detalle = venta.detalle || {};
    const comprobanteLink = detalle.comprobante 
      ? `<a href="${detalle.comprobante}" target="_blank" style="color:#2563eb; text-decoration:underline; font-weight:600;">Ver Archivo</a>` 
      : 'Sin comprobante';

    tr.innerHTML = `
      <td>${venta.id_venta || '-'}</td>
      <td>${venta.cliente || '-'}</td>
      <td>$${parseFloat(venta.total || 0).toLocaleString()}</td>
      <td><span style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-weight:600; font-size:0.8rem;">${venta.estado_pago || 'Pendiente'}</span></td>
      <td>${comprobanteLink}</td>
      <td>
        <button type="button" class="row-action-btn btn-edit-venta" style="background:#e0f2fe; color:#0369a1; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; margin-right:4px;">Editar</button>
        <button type="button" class="row-action-btn btn-del-venta" style="background:#fee2e2; color:#b91c1c; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Eliminar</button>
      </td>
    `;

    tr.querySelector('.btn-edit-venta').onclick = () => openEditModal('Venta', tr);
    tr.querySelector('.btn-del-venta').onclick = async () => {
      if (confirm(`¿Estás seguro de eliminar la venta ${venta.id_venta}?`)) {
        const { error } = await supabase.from('ventas').delete().eq('id', venta.id);
        if (!error) {
          cargarVentasDesdeSupabase();
        } else {
          alert("Error al eliminar: " + error.message);
        }
      }
    };

    tbody.appendChild(tr);
  });
}