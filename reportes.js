// reportes.js
import { supabase } from './supabase.js';

export async function updateReportesUI(username = 'Sistema') {
  try {
    // 1. Obtener ventas y compras de Supabase
    const { data: ventas, error: errorVentas } = await supabase.from('ventas').select('*');
    if (errorVentas) console.error("Error al obtener ventas:", errorVentas.message);

    const { data: compras, error: errorCompras } = await supabase.from('compras').select('*');
    if (errorCompras) console.error("Error al obtener compras:", errorCompras.message);

    let totalVentas = 0;
    let totalCompras = 0;

    // Sumar ventas
    if (ventas && ventas.length > 0) {
      ventas.forEach(v => {
        totalVentas += parseFloat(v.total || v.total_venta || v.monto || 0);
      });
    }

    // Sumar compras
    if (compras && compras.length > 0) {
      compras.forEach(c => {
        totalCompras += parseFloat(c.total || c.total_compra || c.monto || 0);
      });
    }

    const balanceNeto = totalVentas - totalCompras;

    // 2. Actualizar los elementos visuales usando los IDs exactos del HTML
    const lblIngresos = document.getElementById('rep-ingresos');
    const lblCompras = document.getElementById('rep-compras');
    const lblBalance = document.getElementById('rep-balance');

    if (lblIngresos) lblIngresos.textContent = `$${totalVentas.toLocaleString()}`;
    if (lblCompras) lblCompras.textContent = `$${totalCompras.toLocaleString()}`;
    if (lblBalance) lblBalance.textContent = `$${balanceNeto.toLocaleString()}`;

    // 3. Registrar snapshot financiero en la tabla 'reportes' de Supabase
    const fechaStr = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    await supabase.from('reportes').insert([{
      fecha: fechaStr,
      tipo_reporte: 'Balance Financiero',
      resumen: { totalVentas, totalCompras, balanceNeto },
      usuario: username
    }]);

  } catch (error) {
    console.error("Excepción al actualizar reportes:", error);
  }
}