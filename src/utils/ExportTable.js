import ExcelJS from 'exceljs'

const COLUMNAS_BASE = ['Fecha de Emisión', 'Consecutivo', 'Proveedor']

const BORDE_FINO = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' }
}

const ANCHOS = {
  'Fecha de Emisión': 20,
  Consecutivo: 26,
  Proveedor: 34
}

function exportarReporteExcel (checkedTables, facturasSeleccionadas = []) {
  const { columnas, filas } = fusionarTablas(checkedTables)

  const receptor = facturasSeleccionadas[0]?.Receptor
  const aoa = construirAoa({
    columnas,
    filas,
    nombreReceptor: receptor?.Nombre || 'No especificado',
    cedulaReceptor: receptor?.Identificacion?.Numero || 'N/A'
  })

  generarExcelConEstilos(aoa, columnas)
}

function generarExcelConEstilos (aoa, columnas) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Reporte')

  // Estilos reutilizables con colores específicos
  const tituloStyle = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } },
    font: { bold: true, size: 14, color: { argb: 'FF1F2937' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  }

  const etiquetaStyle = {
    font: { bold: true, size: 11 },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true }
  }

  const valorStyle = {
    font: { size: 11 },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true }
  }

  const headerStyle = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD8E4BC' } },
    font: { bold: true, color: { argb: 'FF1F2937' }, size: 11 },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
  }

  const totalsStyle = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } },
    font: { bold: true, size: 11, color: { argb: 'FF1F2937' } },
    alignment: { horizontal: 'right', vertical: 'center', wrapText: true },
    numFmt: '0.00'
  }

  const dataStyle = {
    alignment: { horizontal: 'right', vertical: 'center', wrapText: true },
    numFmt: '0.00'
  }

  const textStyle = {
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true }
  }

  // Fila 1: Título "Reporte de compras" (celeste, 2 columnas, negrita, centrado)
  const titleRow = worksheet.addRow([aoa[0][0], ''])
  Object.assign(titleRow.getCell(1), tituloStyle)
  titleRow.getCell(2).fill = tituloStyle.fill
  worksheet.mergeCells('A1:B1')

  // Fila 2: Nombre Cliente — solo la etiqueta en negrita
  const clienteRow = worksheet.addRow([aoa[1][0], aoa[1][1]])
  Object.assign(clienteRow.getCell(1), etiquetaStyle)
  Object.assign(clienteRow.getCell(2), valorStyle)

  // Fila 3: Numero Cédula — solo la etiqueta en negrita
  const cedulaRow = worksheet.addRow([aoa[2][0], aoa[2][1]])
  Object.assign(cedulaRow.getCell(1), etiquetaStyle)
  Object.assign(cedulaRow.getCell(2), valorStyle)

  // Fila 4: Vacía (separador)
  worksheet.addRow([])

  // Fila 5: Headers de columnas (verde claro, negrita)
  const headerRow = worksheet.addRow(aoa[4])
  headerRow.eachCell((cell) => {
    Object.assign(cell, headerStyle)
  })

  // Filas de datos
  for (let i = 5; i < aoa.length - 1; i++) {
    const dataRow = worksheet.addRow(aoa[i])
    dataRow.eachCell((cell, colNumber) => {
      if (colNumber <= 3) {
        // Primeras 3 columnas son texto
        cell.alignment = textStyle.alignment
      } else {
        // Resto son números
        if (typeof cell.value === 'number') {
          cell.numFmt = '0.00'
          cell.alignment = dataStyle.alignment
        }
      }
    })
  }

  // Fila de totales (última fila, celeste #DCE6F1, negrita)
  const totalsRow = worksheet.addRow(aoa[aoa.length - 1])
  totalsRow.eachCell((cell, colNumber) => {
    if (colNumber <= 3) {
      // Primeras 3 columnas: texto con fondo celeste
      cell.font = { bold: true, size: 11, color: { argb: 'FF1F2937' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } }
      cell.alignment = textStyle.alignment
    } else {
      // Columnas de números: aplicar totalsStyle
      Object.assign(cell, totalsStyle)
    }
  })

  // Ancho de columnas. Se asigna columna por columna a proposito: setear
  // worksheet.columns con la propiedad `header` escribiria esos titulos en la fila 1.
  columnas.forEach((col, i) => {
    worksheet.getColumn(i + 1).width = ANCHOS[col] || 18
  })

  // Bordes sobre todo lo que lleva contenido. La fila 4 queda fuera: es el separador.
  aplicarBordes(worksheet, 1, 3, 2)
  aplicarBordes(worksheet, 5, worksheet.rowCount, columnas.length)

  // Exportar archivo (versión navegador)
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'reporte_fusionado.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  })
}

function aplicarBordes (worksheet, filaInicio, filaFin, totalColumnas) {
  for (let fila = filaInicio; fila <= filaFin; fila++) {
    for (let columna = 1; columna <= totalColumnas; columna++) {
      worksheet.getRow(fila).getCell(columna).border = BORDE_FINO
    }
  }
}

function textoHeader (th) {
  const label = th.querySelector('span')
  return (label ? label.textContent : th.textContent).trim()
}

// Orden: base, Exento, Compras por tarifa, Descuento, Otros Cargos, IVA por tarifa, TOTAL.
function rangoColumna (nombre) {
  const base = COLUMNAS_BASE.indexOf(nombre)
  if (base !== -1) return base
  if (nombre === 'Exento') return 100
  if (nombre === 'Descuento') return 1500
  if (nombre === 'Otros Cargos') return 1750
  if (nombre === 'TOTAL') return 9000
  const tarifa = parseFloat(nombre.replace(/[^\d.]/g, '')) || 0
  return (nombre.startsWith('IVA') ? 2000 : 1000) + tarifa
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
