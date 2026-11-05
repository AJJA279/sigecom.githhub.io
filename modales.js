// modales.js
import { supabase } from './supabase.js';

export async function renderTabFields(type, container, rowData = null) {
  if (type === 'Cliente') {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Nombre / Empresa *</label>
          <input type="text" id="val-cliente" required value="${rowData ? rowData[1] : ''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Tipo de Cliente</label>
          <select id="val-tipocliente" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
            <option value="Consumidor final" ${rowData && rowData[2]==='Consumidor final'?'selected':''}>Consumidor final</option>
            <option value="Minorista" ${rowData && rowData[2]==='Minorista'?'selected':''}>Minorista</option>
            <option value="Mayorista" ${rowData && rowData[2]==='Mayorista'?'selected':''}>Mayorista</option>
          </select>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Teléfono</label>
          <input type="text" id="val-telefono" value="${rowData && rowData[3]!=='-'?rowData[3]:''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Correo Electrónico</label>
          <input type="email" id="val-email" value="${rowData && rowData[4]!=='-'?rowData[4]:''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Dirección</label>
          <input type="text" id="val-direccion" value="${rowData && rowData[5]!=='-'?rowData[5]:''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
      </div>
    `;
  } else if (type === 'Proveedor') {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Empresa Proveedora *</label>
          <input type="text" id="val-empresa" required value="${rowData ? rowData[1] : ''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Rubro</label>
          <input type="text" id="val-rubro" value="${rowData ? rowData[2] : ''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Teléfono</label>
          <input type="text" id="val-telefono-prov" value="${rowData && rowData[3]!=='-'?rowData[3]:''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Dirección</label>
          <input type="text" id="val-direccion-prov" value="${rowData && rowData[4]!=='-'?rowData[4]:''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Correo Electrónico</label>
          <input type="email" id="val-email-prov" value="${rowData && rowData[5]!=='-'?rowData[5]:''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Productos Ofrecidos (Referencia)</label>
          <input type="text" id="val-productos-prov" value="${rowData && rowData[6]!=='-'?rowData[6]:''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
      </div>
    `;
  } else if (type === 'Producto') {
    const { data: proveedores } = await supabase.from('proveedores').select('empresa');
    const opcionesProveedores = proveedores && proveedores.length > 0
      ? proveedores.map(p => `<option value="${p.empresa}" ${rowData && rowData[6] === p.empresa ? 'selected' : ''}>${p.empresa}</option>`).join('')
      : '<option value="Sin asignar">Sin proveedores registrados</option>';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Nombre del Producto *</label>
          <input type="text" id="val-prod-nombre" required placeholder="Ej: Remera lisa" value="${rowData ? rowData[1] : ''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Categoría</label>
          <input type="text" id="val-prod-categoria" placeholder="Ej: Indumentaria" value="${rowData ? rowData[2] : ''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Stock Actual</label>
          <input type="number" id="val-prod-stock" value="${rowData ? rowData[3] : '0'}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Precio de Compra ($)</label>
          <input type="number" step="0.01" id="val-prod-pcompra" placeholder="0.00" value="${rowData ? rowData[4].replace('$', '').replace(/,/g, '') : ''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Precio de Venta ($)</label>
          <input type="number" step="0.01" id="val-prod-pventa" placeholder="0.00" value="${rowData ? rowData[5].replace('$', '').replace(/,/g, '') : ''}" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Proveedor *</label>
          <select id="val-prod-proveedor" required style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
            <option value="">-- Seleccionar Proveedor --</option>
            ${opcionesProveedores}
          </select>
        </div>
      </div>
    `;
  } else if (type === 'Compra') {
    const { data: proveedores } = await supabase.from('proveedores').select('id, empresa');
    const { data: productos } = await supabase.from('productos').select('id, nombre, precio_compra');

    const opcionesProv = proveedores && proveedores.length > 0
      ? proveedores.map(p => `<option value="${p.id}" ${rowData && rowData[1] === p.empresa ? 'selected' : ''}>${p.empresa}</option>`).join('')
      : '<option value="">No hay proveedores cargados</option>';

    const opcionesProd = productos && productos.length > 0
      ? productos.map(prod => `<option value="${prod.id}" data-precio="${prod.precio_compra || 0}">${prod.nombre} (P. Compra: $${prod.precio_compra || 0})</option>`).join('')
      : '<option value="">No hay productos en inventario</option>';

    const nroOrdenVal = rowData ? rowData[0] : 'OC-1922';
    const estadoVal = rowData ? rowData[3] : 'Pendiente de entrega';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div class="form-section-card" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 0.95rem; font-weight: 700; color: #0b1e36; margin-bottom: 0.75rem;">Cabecera de Orden de Compra</h3>
          
          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Nº de Orden *</label>
            <input type="text" id="val-compra-nro" value="${nroOrdenVal}" ${rowData ? 'readonly' : ''} style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Proveedor *</label>
            <select id="val-compra-proveedor" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="">Seleccione un proveedor</option>
              ${opcionesProv}
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Estado de Entrega *</label>
            <select id="val-compra-estado" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="Pendiente de entrega" ${estadoVal === 'Pendiente de entrega' ? 'selected' : ''}>Pendiente de entrega</option>
              <option value="Entregado" ${estadoVal === 'Entregado' ? 'selected' : ''}>Entregado</option>
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Modalidad de Logística *</label>
            <select id="val-compra-logistica" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="Envio con transporte pagado" ${rowData && rowData[4] === 'Envio con transporte pagado' ? 'selected' : ''}>Envío con transporte pagado</option>
              <option value="Retiro en local" ${rowData && rowData[4] === 'Retiro en local' ? 'selected' : ''}>Retiro en local</option>
            </select>
          </div>
        </div>

        ${!rowData ? `
        <div class="form-section-card" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 0.95rem; font-weight: 700; color: #0b1e36; margin-bottom: 0.75rem;">Productos a Comprar</h3>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Seleccionar Producto *</label>
            <select id="val-compra-producto-select" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="">-- Seleccionar del inventario --</option>
              ${opcionesProd}
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.75rem;">
            <div style="display: flex; flex-direction: column; gap: 0.35rem;">
              <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Cantidad *</label>
              <input type="number" id="val-compra-cant" min="1" value="1" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.35rem;">
              <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Precio Unitario ($) *</label>
              <input type="number" step="0.01" id="val-compra-precio" value="0" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
            </div>
          </div>
          <div style="text-align: right; font-weight: 700; font-size: 0.9rem; color: #0b1e36;">
            <span>Gasto Total Estimado: <strong id="lbl-compra-total">$0</strong></span>
          </div>
        </div>
        ` : `
        <div style="padding: 0.75rem; background: #f1f5f9; border-radius: 8px; font-size: 0.85rem; color: #475569;">
          Monto actual de la orden: <strong>${rowData[2]}</strong>
        </div>
        `}

        <div class="form-section-card" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 0.95rem; font-weight: 700; color: #0b1e36; margin-bottom: 0.75rem;">📦 Detalle de Envío / Logística</h3>
          
          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Tipo de Transporte</label>
            <select id="val-envio-tipo" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="Servicio de empresa">Servicio de empresa</option>
              <option value="Externo">Externo</option>
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Transporte Asignado (Obligatorio) *</label>
            <input type="text" id="val-envio-transporte" placeholder="Ej. Logística Expreso" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Patente del Vehículo (Opcional)</label>
            <input type="text" id="val-envio-patente" placeholder="Ej. AA123CD" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Nombre del Chofer (Opcional)</label>
            <input type="text" id="val-envio-chofer" placeholder="Nombre completo" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Facturación del Viaje *</label>
            <select id="val-envio-facturacion" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="Abonado por el comprador">Abonado por el comprador</option>
              <option value="Abonado por el vendedor">Abonado por el vendedor</option>
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Coste del Viaje ($)</label>
            <input type="number" id="val-envio-coste" value="0" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Comprobante (Archivo o Imagen)</label>
            <input type="file" id="val-envio-comprobante" style="padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; background: #fff;" />
          </div>
        </div>
      </div>
    `;

    const prodSelect = document.getElementById('val-compra-producto-select');
    const cantInput = document.getElementById('val-compra-cant');
    const precioInput = document.getElementById('val-compra-precio');
    const costeEnvioInput = document.getElementById('val-envio-coste');
    const lblTotal = document.getElementById('lbl-compra-total');

    function calcularTotalCompra() {
      const cantidad = parseFloat(cantInput?.value) || 0;
      const precioUnit = parseFloat(precioInput?.value) || 0;
      const envio = parseFloat(costeEnvioInput?.value) || 0;
      const totalGeneral = (cantidad * precioUnit) + envio;
      if (lblTotal) lblTotal.textContent = `$${totalGeneral.toLocaleString()}`;
    }

    if (prodSelect && prodSelect.options.length > 1 && !rowData) {
      prodSelect.selectedIndex = 1;
      const firstOption = prodSelect.options[1];
      if (precioInput) precioInput.value = firstOption.getAttribute('data-precio') || 0;
      calcularTotalCompra();
    }

    if (prodSelect) {
      prodSelect.onchange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const precioBase = selectedOption.getAttribute('data-precio') || 0;
        if (precioInput) precioInput.value = precioBase;
        calcularTotalCompra();
      };
    }

    if (cantInput) cantInput.oninput = calcularTotalCompra;
    if (precioInput) precioInput.oninput = calcularTotalCompra;
    if (costeEnvioInput) costeEnvioInput.oninput = calcularTotalCompra;

  } else if (type === 'Venta') {
    const { data: clientes } = await supabase.from('clientes').select('nombre');
    const { data: productos } = await supabase.from('productos').select('id, nombre, precio_venta, stock');

    const generatedVentaId = rowData ? rowData[0] : 'V-' + Math.floor(100000 + Math.random() * 900000);
    const clienteVal = rowData ? rowData[1] : '';
    const estadoPagoVal = rowData ? rowData[4] : 'Pagado en su totalidad';

    const opcionesCli = clientes && clientes.length > 0
      ? clientes.map(c => `<option value="${c.nombre}" ${clienteVal === c.nombre ? 'selected' : ''}>${c.nombre}</option>`).join('')
      : '<option value="">No hay clientes cargados</option>';

    const opcionesProd = productos && productos.length > 0
      ? productos.map(prod => `<option value="${prod.id}" data-precio="${prod.precio_venta || 0}" data-stock="${prod.stock || 0}">${prod.nombre} (Stock: ${prod.stock || 0} | P. Venta: $${prod.precio_venta || 0})</option>`).join('')
      : '<option value="">No hay productos en inventario</option>';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div class="form-section-card" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 0.95rem; font-weight: 700; color: #0b1e36; margin-bottom: 0.75rem;">Cabecera de Venta</h3>
          
          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">ID Venta *</label>
            <input type="text" id="val-venta-id" value="${generatedVentaId}" ${rowData ? 'readonly' : ''} style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Cliente *</label>
            <select id="val-venta-cliente" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="">Seleccione un cliente</option>
              ${opcionesCli}
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Estado de Pago *</label>
            <select id="val-venta-pago" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="Pagado en su totalidad" ${estadoPagoVal === 'Pagado en su totalidad' ? 'selected' : ''}>Pagado en su totalidad</option>
              <option value="Pendiente" ${estadoPagoVal === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Modalidad de Logística *</label>
            <select id="val-venta-logistica" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="Envio con transporte pagado">Envío con transporte pagado</option>
              <option value="Retira en tienda">Retira en tienda</option>
            </select>
          </div>
        </div>

        ${!rowData ? `
        <div class="form-section-card" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 0.95rem; font-weight: 700; color: #0b1e36; margin-bottom: 0.75rem;">Productos a Vender</h3>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Seleccionar Producto *</label>
            <select id="val-venta-producto-select" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="">-- Seleccionar del inventario --</option>
              ${opcionesProd}
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.75rem;">
            <div style="display: flex; flex-direction: column; gap: 0.35rem;">
              <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Cantidad *</label>
              <input type="number" id="val-venta-cant" min="1" value="1" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.35rem;">
              <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Precio Unitario ($) *</label>
              <input type="number" step="0.01" id="val-venta-precio" value="0" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
            </div>
          </div>
          <div style="text-align: right; font-weight: 700; font-size: 0.9rem; color: #0b1e36;">
            <span>Cobro Total Estimado: <strong id="lbl-venta-total">$0</strong></span>
          </div>
        </div>
        ` : `
        <div style="padding: 0.75rem; background: #f1f5f9; border-radius: 8px; font-size: 0.85rem; color: #475569;">
          Monto total de venta: <strong>${rowData[3]}</strong>
        </div>
        `}

        <div class="form-section-card" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 0.95rem; font-weight: 700; color: #0b1e36; margin-bottom: 0.75rem;">📦 Detalle de Envío / Logística</h3>
          
          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Tipo de Transporte</label>
            <select id="val-venta-envio-tipo" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="Servicio de empresa">Servicio de empresa</option>
              <option value="Externo">Externo</option>
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Transporte Asignado (Obligatorio) *</label>
            <input type="text" id="val-venta-envio-transporte" placeholder="Ej. Flete Express" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Patente del Vehículo (Opcional)</label>
            <input type="text" id="val-venta-envio-patente" placeholder="Ej. AA123CD" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Nombre del Chofer (Opcional)</label>
            <input type="text" id="val-venta-envio-chofer" placeholder="Nombre completo" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Facturación del Viaje *</label>
            <select id="val-venta-envio-facturacion" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;">
              <option value="Abonado por el comprador">Abonado por el comprador</option>
              <option value="Abonado por el vendedor">Abonado por el vendedor</option>
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Coste del Viaje ($)</label>
            <input type="number" id="val-venta-envio-coste" value="0" style="padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            <label style="font-size: 0.85rem; font-weight: 600; color: #334155;">Comprobante (Archivo o Imagen)</label>
            <input type="file" id="val-venta-envio-comprobante" style="padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; background: #fff;" />
          </div>
        </div>
      </div>
    `;

    const prodSelect = document.getElementById('val-venta-producto-select');
    const cantInput = document.getElementById('val-venta-cant');
    const precioInput = document.getElementById('val-venta-precio');
    const costeEnvioInput = document.getElementById('val-venta-envio-coste');
    const lblTotal = document.getElementById('lbl-venta-total');

    function calcularTotalVenta() {
      const cantidad = parseFloat(cantInput?.value) || 0;
      const precioUnit = parseFloat(precioInput?.value) || 0;
      const envio = parseFloat(costeEnvioInput?.value) || 0;
      const totalGeneral = (cantidad * precioUnit) + envio;
      if (lblTotal) lblTotal.textContent = `$${totalGeneral.toLocaleString()}`;
    }

    if (prodSelect && prodSelect.options.length > 1 && !rowData) {
      prodSelect.selectedIndex = 1;
      const firstOption = prodSelect.options[1];
      if (precioInput) precioInput.value = firstOption.getAttribute('data-precio') || 0;
      calcularTotalVenta();
    }

    if (prodSelect) {
      prodSelect.onchange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const precioBase = selectedOption.getAttribute('data-precio') || 0;
        if (precioInput) precioInput.value = precioBase;
        calcularTotalVenta();
      };
    }

    if (cantInput) cantInput.oninput = calcularTotalVenta;
    if (precioInput) precioInput.oninput = calcularTotalVenta;
    if (costeEnvioInput) costeEnvioInput.oninput = calcularTotalVenta;
  }
}

export function initDetalleModal() {
  const detalleModal = document.getElementById('detalle-modal');
  const closeBtn = document.getElementById('detalle-close-btn');
  if (!detalleModal) return;
  const close = () => { detalleModal.style.display = 'none'; };
  if (closeBtn) closeBtn.onclick = close;
  window.addEventListener('click', (e) => { if (e.target === detalleModal) close(); });
}