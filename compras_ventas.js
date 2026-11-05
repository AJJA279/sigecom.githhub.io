// compras_ventas.js
import { supabase } from './supabase.js';

// --- REGISTRAR MOVIMIENTO EN SUPABASE ---
export async function registerAutoMovement(fecha, usuario, tipo, descripcion) {
  try {
    const { error } = await supabase.from('movimientos').insert([{
      fecha: fecha,
      usuario: usuario || 'Sistema',
      tipo: tipo,
      descripcion: descripcion
    }]);

    if (error) {
      console.error("Error al registrar movimiento en Supabase:", error.message);
    } else {
      renderizarMovimientosUI();
    }
  } catch (err) {
    console.error("Excepción al registrar movimiento:", err);
  }
}

// --- RENDERIZAR MOVIMIENTOS DESDE SUPABASE ---
export async function renderizarMovimientosUI() {
  const container = document.getElementById('tabla-movimientos-body') || document.querySelector('#table-movimientos tbody');
  if (!container) return;

  const { data: movimientos, error } = await supabase
    .from('movimientos')
    .select('*')
    .order('id', { ascending: false }); // Los más recientes primero

  if (error) {
    console.error("Error al obtener movimientos de Supabase:", error.message);
    return;
  }

  if (!movimientos || movimientos.length === 0) {
    container.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 1rem;">No hay movimientos registrados todavía.</td></tr>`;
    return;
  }

  container.innerHTML = '';
  movimientos.forEach(mov => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; color: #334155;">${mov.fecha}</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; font-weight: 600; color: #0b1e36;">${mov.usuario}</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem;">
        <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${mov.tipo}</span>
      </td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; color: #475569;">${mov.descripcion}</td>
    `;
    container.appendChild(tr);
  });
}

// Compatibilidad con el Dashboard
export function renderAlertasUI() {
  renderizarMovimientosUI();
}









