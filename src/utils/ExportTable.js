import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const COLUMNAS_BASE = ['Fecha de Emisión', 'Consecutivo', 'Proveedor']

function exportarReporteExcel (checkedTables, facturasSeleccionadas = []) {
  const { columnas, filas } = fusionarTablas(checkedTables)

  const receptor = facturasSeleccionadas[0]?.Receptor
  const aoa = construirAoa({
    columnas,
    filas,
    nombreReceptor: receptor?.Nombre || 'No especificado',
    cedulaReceptor: receptor?.Identificacion?.Numero || 'N/A'
  })

  const ws = XLSX.utils.aoa_to_sheet(aoa)
  ws['!cols'] = columnas.map(columna => ({ wch: columna === 'Proveedor' ? 28 : 16 }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
  XLSX.writeFile(wb, 'reporte_fusionado.xlsx')
}

// El header de las columnas con tooltip es el primer span; el ícono es un span
// aparte cuyo texto es "i" y contaminaría el nombre de la columna.
function textoHeader (th) {
  const label = th.querySelector('span')
  return (label ? label.textContent : th.textContent).trim()
}

function rangoColumna (nombre) {
  const base = COLUMNAS_BASE.indexOf(nombre)
  if (base !== -1) return base
  if (nombre === 'TOTAL') return 9000
  if (nombre === 'Exento') return 8000
  const tarifa = parseFloat(nombre.replace(/[^\d.]/g, '')) || 0
  return 100 + tarifa * 10 + (nombre.startsWith('IVA') ? 1 : 0)
}

function fusionarTablas (checkedTables) {
  const columnas = new Set()
  const filas = []

  checkedTables.forEach(({ tabla }) => {
    const headers = Array.from(tabla.querySelectorAll('thead th')).map(textoHeader)
    headers.forEach(header => columnas.add(header))

    tabla.querySelectorAll('tbody tr').forEach(tr => {
      const celdas = Array.from(tr.querySelectorAll('td'))
      if (celdas.length === 0) return
      const fila = {}
      headers.forEach((header, i) => {
        fila[header] = celdas[i] ? celdas[i].textContent.trim() : ''
      })
      filas.push(fila)
    })
  })

  return {
    columnas: Array.from(columnas).sort((a, b) => rangoColumna(a) - rangoColumna(b)),
    filas
  }
}

function construirAoa ({ columnas, filas, nombreReceptor, cedulaReceptor }) {
  const aoa = [
    ['Reporte de compras'],
    ['Nombre Cliente', nombreReceptor],
    ['Numero Cédula', cedulaReceptor],
    [],
    columnas
  ]

  const totales = {}

  filas.forEach(fila => {
    aoa.push(columnas.map(columna => {
      const valor = fila[columna] ?? ''
      if (COLUMNAS_BASE.includes(columna)) return valor

      const numero = parseFloat(valor)
      if (isNaN(numero)) return ''
      totales[columna] = (totales[columna] || 0) + numero
      return numero
    }))
  })

  aoa.push(columnas.map((columna, i) => {
    if (i === 0) return 'Total'
    if (COLUMNAS_BASE.includes(columna)) return ''
    return columna in totales ? parseFloat(totales[columna].toFixed(2)) : ''
  }))

  return aoa
}

export { exportarReporteExcel }
