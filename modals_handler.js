// modals_handler.js
import { supabase } from './supabase.js';
import { 
  cargarProductosDesdeSupabase, 
  cargarProveedoresDesdeSupabase, 
  cargarClientesDesdeSupabase 
} from './productos.js';
import { registerAutoMovement } from './compras_ventas.js';
import { updateReportesUI } from './reportes.js';
import { renderTabFields } from './modales.js';

window.editingRow = null;
window.editingType = null;

export function openEditModal(tipo, tr) {
  window.editingRow = tr;
  window.editingType = tipo.trim();
  
  // Guardamos el dataset o la celda ID si la tienes disponible
  const rowData = Array.from(tr.cells).map(cell => cell.textContent);
  window.editingId = tr.dataset.id || rowData[0].trim(); // Si guardas el ID en el tr o usas la celda

  const modal = document.getElementById('dynamic-modal');
  const fieldsContainer = document.getElementById('modal-fields-container');
  const modalTitle = document.getElementById('modal-title');
  const tabsContainer = document.getElementById('modal-tabs-container');

  if (!modal || !fieldsContainer) return;
  if (modalTitle) modalTitle.textContent = `Editar ${tipo}`;
  if (tabsContainer) tabsContainer.style.display = 'none';

  renderTabFields(tipo, fieldsContainer, rowData);
  modal.style.display = 'flex';
}

export function initExactModalSystem(username) {
  const modal = document.getElementById('dynamic-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const fieldsContainer = document.getElementById('modal-fields-container');
  const form = document.getElementById('dynamic-form');
  const tabButtons = document.querySelectorAll('.modal-tab-btn');
  const tabsContainer = document.getElementById('modal-tabs-container');
  const modalTitle = document.getElementById('modal-title');

  if (!modal || !form) return;

  let activeTabType = 'Cliente';

  document.querySelectorAll('.btn-global-modal').forEach(btn => {
    btn.addEventListener('click', async () => {
      window.editingRow = null;
      window.editingType = null;
      if (modalTitle) modalTitle.textContent = 'Nuevo movimiento';
      if (tabsContainer) tabsContainer.style.display = 'flex';
      setActiveTab('Cliente');
      modal.style.display = 'flex';
    });
  });

  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) setActiveTab(tabName);
    });
  });

  async function setActiveTab(tabName) {
    activeTabType = tabName;
    tabButtons.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabName));
    await renderTabFields(tabName, fieldsContainer);
  }

  const closeModal = () => { 
    modal.style.display = 'none'; 
    window.editingRow = null; 
    window.editingType = null;
    form.reset();
  };

  if (closeBtn) closeBtn.onclick = closeModal;
  if (cancelBtn) cancelBtn.onclick = closeModal;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' - ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // === MODO EDICIÓN (ACTUALIZAR EN SUPABASE PARA CUALQUIER TABLA) ===
    if (window.editingRow) {
      const tipoEdicion = (window.editingType || activeTabType).toLowerCase();
      const rowData = Array.from(window.editingRow.cells).map(cell => cell.textContent);
      const idOriginal = rowData[0].trim();

      if (tipoEdicion.includes('cliente')) {
        const name = document.getElementById('val-cliente')?.value.trim() || '';
        const tipoCliente = document.getElementById('val-tipocliente')?.value || 'Consumidor final';
        const phone = document.getElementById('val-telefono')?.value.trim() || null;
        const email = document.getElementById('val-email')?.value.trim() || null;
        const direccion = document.getElementById('val-direccion')?.value.trim() || null;

        if (!name) return alert("El nombre del cliente es obligatorio.");

        const { error } = await supabase
          .from('clientes')
          .update({ nombre: name, tipo: tipoCliente, telefono: phone, email: email, direccion: direccion })
          .eq('id', parseInt(idOriginal) || idOriginal);

        if (error) return alert("Error al actualizar cliente: " + error.message);
        await cargarClientesDesdeSupabase();
        registerAutoMovement(dateStr, username, 'Modificación', `Cliente actualizado: ${name}`);
      } 
  
      else if (tipoEdicion.includes('proveedor')) {
        const empresa = document.getElementById('val-empresa')?.value.trim() || '';
        const rubro = document.getElementById('val-rubro')?.value.trim() || '';
        const tel = document.getElementById('val-telefono-prov')?.value.trim() || null;
        const dir = document.getElementById('val-direccion-prov')?.value.trim() || null;
        const email = document.getElementById('val-email-prov')?.value.trim() || null;
        const prods = document.getElementById('val-productos-prov')?.value.trim() || null;

        if (!empresa) return alert("El nombre de la empresa es obligatorio.");

        const targetId = window.editingId;
        if (!targetId) return alert("No se pudo identificar el ID del proveedor.");

        const { error } = await supabase
          .from('proveedores')
          .update({ 
            empresa: empresa, 
            rubro: rubro, 
            telefono: tel, 
            direccion: dir, 
            email: email, 
            productos: prods 
          })
          .eq('id', parseInt(targetId) || targetId); // Filtro seguro por ID numérico o texto

        if (error) return alert("Error al actualizar proveedor en Supabase: " + error.message);

        await cargarProveedoresDesdeSupabase();
        registerAutoMovement(dateStr, username, 'Modificación', `Proveedor actualizado: ${empresa}`);
      }

      else if (tipoEdicion.includes('producto')) {
        const nombre = document.getElementById('val-prod-nombre')?.value.trim() || '';
        const cat = document.getElementById('val-prod-categoria')?.value.trim() || '';
        const stock = parseInt(document.getElementById('val-prod-stock')?.value) || 0;
        const pcompra = parseFloat(document.getElementById('val-prod-pcompra')?.value) || 0;
        const pventa = parseFloat(document.getElementById('val-prod-pventa')?.value) || 0;
        const proveedor = document.getElementById('val-prod-proveedor')?.value.trim() || 'Sin asignar';

        if (!nombre) return alert("El nombre del producto es obligatorio.");

        const { error } = await supabase
          .from('productos')
          .update({ nombre, categoria: cat, stock, precio_compra: pcompra, precio_venta: pventa, proveedor_empresa: proveedor })
          .eq('sku', idOriginal);

        if (error) return alert("Error al actualizar producto: " + error.message);
        await cargarProductosDesdeSupabase();
        registerAutoMovement(dateStr, username, 'Modificación', `Producto actualizado: ${nombre}`);
      }
else if (tipoEdicion.includes('compra')) {
        const estadoEntrega = document.getElementById('val-compra-estado')?.value || 'Pendiente de entrega';
        
        // Usamos el ID único de la fila en lugar del número de orden repetido
        const targetId = window.editingId; 

        if (!targetId) return alert("No se pudo identificar el registro de la compra.");

        const { error } = await supabase
          .from('compras')
          .update({ estado: estadoEntrega })
          .eq('id', parseInt(targetId) || targetId); // Actualiza SOLO esta fila exacta por su ID

        if (error) return alert("Error al actualizar compra: " + error.message);
        registerAutoMovement(dateStr, username, 'Modificación', `Compra ID ${targetId} actualizada a: ${estadoEntrega}`);
      }      
    
      else if (tipoEdicion.includes('venta')) {
        const estadoPago = document.getElementById('val-venta-pago')?.value || 'Pagado en su totalidad';
        const ventaId = idOriginal.trim(); // Aseguramos limpiar espacios

        if (!ventaId) return alert("No se pudo identificar el ID de la venta.");

        const { error } = await supabase
          .from('ventas')
          .update({ estado_pago: estadoPago })
          .eq('id_venta', ventaId); // Filtro estricto para que solo afecte a esta venta

        if (error) return alert("Error al actualizar venta: " + error.message);
        registerAutoMovement(dateStr, username, 'Modificación', `Venta ${ventaId} actualizada a estado de pago: ${estadoPago}`);
      }

      updateReportesUI();
      modal.style.display = 'none';
      window.editingRow = null;
      window.editingType = null;
      form.reset();

      setTimeout(() => { window.location.reload(); }, 700);
      return;
    }

    // === ALTAS NUEVAS (CLIENTE, PROVEEDOR, PRODUCTO, COMPRA, VENTA) ===
    if (activeTabType === 'Cliente') {
      const name = document.getElementById('val-cliente')?.value.trim() || '';
      const tipoCliente = document.getElementById('val-tipocliente')?.value || 'Consumidor final';
      const phone = document.getElementById('val-telefono')?.value.trim() || null;
      const email = document.getElementById('val-email')?.value.trim() || null;
      const direccion = document.getElementById('val-direccion')?.value.trim() || null;

      if (!name) return alert("El nombre del cliente es obligatorio.");

      const { error } = await supabase.from('clientes').insert([{ nombre: name, tipo: tipoCliente, telefono: phone, email: email, direccion: direccion }]);
      if (error) return alert("Error en Supabase: " + error.message);
      
      await cargarClientesDesdeSupabase();
      registerAutoMovement(dateStr, username, 'Nuevo Cliente', `Alta: ${name}`);
    }
    else if (activeTabType === 'Proveedor') {
      const empresa = document.getElementById('val-empresa')?.value.trim() || '';
      const rubro = document.getElementById('val-rubro')?.value.trim() || '';
      const tel = document.getElementById('val-telefono-prov')?.value.trim() || null;
      const dir = document.getElementById('val-direccion-prov')?.value.trim() || null;
      const email = document.getElementById('val-email-prov')?.value.trim() || null;
      const prods = document.getElementById('val-productos-prov')?.value.trim() || null;
      
      if (!empresa) return alert("El nombre de la empresa es obligatorio.");

      const { error } = await supabase.from('proveedores').insert([{ empresa, rubro, telefono: tel, direccion: dir, email, productos: prods }]);
      if (error) return alert("Error en Supabase: " + error.message);

      await cargarProveedoresDesdeSupabase();
      registerAutoMovement(dateStr, username, 'Nuevo Proveedor', `Alta: ${empresa}`);
    }
    else if (activeTabType === 'Producto') {
      const nombre = document.getElementById('val-prod-nombre')?.value.trim() || '';
      const cat = document.getElementById('val-prod-categoria')?.value.trim() || '';
      const stock = parseInt(document.getElementById('val-prod-stock')?.value) || 0;
      const pcompra = parseFloat(document.getElementById('val-prod-pcompra')?.value) || 0;
      const pventa = parseFloat(document.getElementById('val-prod-pventa')?.value) || 0;
      const proveedor = document.getElementById('val-prod-proveedor')?.value.trim() || 'Sin asignar';

      if (!nombre) return alert("El nombre del producto es obligatorio.");
      const generatedSku = 'SKU-' + Math.floor(100000 + Math.random() * 900000);

      const { error } = await supabase.from('productos').insert([{ sku: generatedSku, nombre, categoria: cat, stock, precio_compra: pcompra, precio_venta: pventa, proveedor_empresa: proveedor }]);
      if (error) return alert("Error al guardar producto: " + error.message);

      await cargarProductosDesdeSupabase();
      registerAutoMovement(dateStr, username, 'Nuevo Producto', `Prod: ${nombre} (SKU: ${generatedSku})`);
    }
    else if (activeTabType === 'Compra') {
      const orden = document.getElementById('val-compra-nro')?.value.trim() || 'OC-1922';
      const proveedorId = document.getElementById('val-compra-proveedor')?.value;
      const estadoEntrega = document.getElementById('val-compra-estado')?.value || 'Pendiente de entrega';
      const modalidadLogistica = document.getElementById('val-compra-logistica')?.value || '';
      
      const productoId = document.getElementById('val-compra-producto-select')?.value;
      const cantidad = parseInt(document.getElementById('val-compra-cant')?.value) || 1;
      const precioUnitario = parseFloat(document.getElementById('val-compra-precio')?.value) || 0;
      const transporteAsignado = document.getElementById('val-envio-transporte')?.value.trim() || '';

      if (!proveedorId) return alert("Debe seleccionar un proveedor válido.");
      if (!productoId) return alert("Debe seleccionar un producto del inventario.");

      const subtotalProductos = cantidad * precioUnitario;
      const costeViaje = parseFloat(document.getElementById('val-envio-coste')?.value) || 0;
      const totalFinalCompra = subtotalProductos + costeViaje;

      const { error } = await supabase.from('compras').insert([{
        numero_orden: orden,
        proveedor_id: parseInt(proveedorId),
        total: totalFinalCompra,
        estado: estadoEntrega,
        detalle_items: { productoId, cantidad, precioUnitario, subtotalProductos, modalidadLogistica, transporteAsignado }
      }]);

      if (error) return alert("Error al guardar compra: " + error.message);

      alert("¡Compra registrada con éxito!");
      registerAutoMovement(dateStr, username, 'Orden de Compra', `Orden ${orden} Total: $${totalFinalCompra}`);
    }
    else if (activeTabType === 'Venta') {
      const idVenta = document.getElementById('val-venta-id')?.value.trim() || 'V-3192';
      const cliente = document.getElementById('val-venta-cliente')?.value || '';
      const estadoPago = document.getElementById('val-venta-pago')?.value || '';
      const productoId = document.getElementById('val-venta-producto-select')?.value;
      const cantidad = parseInt(document.getElementById('val-venta-cant')?.value) || 1;
      const precioUnitario = parseFloat(document.getElementById('val-venta-precio')?.value) || 0;

      if (!cliente) return alert("Debe seleccionar un cliente.");
      if (!productoId) return alert("Debe seleccionar un producto.");

      const subtotalProductos = cantidad * precioUnitario;
      const costeViaje = parseFloat(document.getElementById('val-venta-envio-coste')?.value) || 0;
      const totalFinalVenta = subtotalProductos + costeViaje;

      const { error } = await supabase.from('ventas').insert([{
        id_venta: idVenta,
        cliente: cliente,
        total: totalFinalVenta, 
        estado_pago: estadoPago,
        detalle: { productoId, cantidad, precioUnitario, subtotalProductos }
      }]);

      if (error) return alert("Error al guardar venta: " + error.message);

      alert("¡Venta registrada con éxito!");
      registerAutoMovement(dateStr, username, 'Venta Registrada', `Venta ${idVenta} Total: $${totalFinalVenta}`);
    }

    updateReportesUI();
    form.reset();
    modal.style.display = 'none';
    setTimeout(() => { window.location.reload(); }, 700);
  };
}

export function initDetalleModal() {
  const detalleModal = document.getElementById('detalle-modal');
  const closeBtn = document.getElementById('detalle-close-btn');
  if (!detalleModal) return;
  const close = () => { detalleModal.style.display = 'none'; };
  if (closeBtn) closeBtn.onclick = close;
  window.addEventListener('click', (e) => { if (e.target === detalleModal) close(); });
}