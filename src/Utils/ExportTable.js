import * as XLSX from 'https://esm.run/xlsx'

function exportarReporteExcel (tablaFusionada) {
  // Lógica para exportar la tabla fusionada a Excel; usando xlsx
  // Crear un libro de trabajo y una hoja de cálculo
  const wb = XLSX.utils.table_to_book(tablaFusionada, { sheet: 'Reporte' })
  // Guardar el archivo Excel
  XLSX.writeFile(wb, 'reporte_fusionado.xlsx')
}

export { exportarReporteExcel }
