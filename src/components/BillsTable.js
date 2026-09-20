import { CHECKED_TABLES } from '../config/constants.js'
import { CardFactory, CheckboxFactory, ButtonFactory, TooltipFactory } from '../utils/ComponentFactory.js'

function getTablaFactura (idFactura, dataFacturas = null, descartarFactura) {
  if (!dataFacturas || dataFacturas.length === 0) return 'No hay facturas para mostrar.'
  const { tipo, listaImpuestos, nombreArchivoXML } = dataFacturas

  // Crear contenedor con nombre de archivo
  const headerContainer = document.createElement('div')
  headerContainer.style.display = 'flex'
  headerContainer.style.alignItems = 'center'
  headerContainer.style.justifyContent = 'space-between'
  headerContainer.style.marginBottom = 'var(--spacing-md)'

  const fileNameEl = document.createElement('span')
  fileNameEl.textContent = nombreArchivoXML
  fileNameEl.style.fontWeight = '600'
  fileNameEl.style.color = 'var(--text-primary)'
  headerContainer.appendChild(fileNameEl)

  // Agregar badge según tipo de documento
  const badge = document.createElement('span')
  badge.style.display = 'inline-flex'
  badge.style.alignItems = 'center'
  badge.style.padding = '4px 12px'
  badge.style.borderRadius = '16px'
  badge.style.fontSize = '12px'
  badge.style.fontWeight = '600'
  badge.style.letterSpacing = '0.3px'
  badge.style.whiteSpace = 'nowrap'

  if (tipo === 'NotaCredito') {
    badge.textContent = 'Nota de Crédito'
    badge.style.backgroundColor = '#ccfbf1'
    badge.style.color = '#0d9488'
    badge.style.border = '1px solid #99f6e4'
  } else {
    badge.textContent = 'Factura Electrónica'
    badge.style.backgroundColor = '#fef3c7'
    badge.style.color = '#b45309'
    badge.style.border = '1px solid #fde047'
  }

  headerContainer.appendChild(badge)

  const card = CardFactory.create(null)
  card.appendChild(headerContainer)

  const tablaContenidos = buildInvoiceTable(idFactura, dataFacturas, listaImpuestos)
  const optionsContainer = buildInvoiceOptions(idFactura, tablaContenidos, descartarFactura)

  card.appendChild(optionsContainer)
  card.appendChild(tablaContenidos)

  return card
}

function buildInvoiceTable (idFactura, dataFacturas, listaImpuestos) {
  const { proveedor, fechaEmision, numeroConsecutivo } = dataFacturas
  const table = document.createElement('table')
  table.className = 'table-contents mt-1'

  const thead = table.createTHead()
  const headerRow = document.createElement('tr')

  const headers = ['Fecha de Emisión', 'Consecutivo', 'Proveedor']
  headers.forEach(header => {
    const th = document.createElement('th')
    th.textContent = header
    headerRow.appendChild(th)
  })

  const tarifas = Object.keys(listaImpuestos)
    .sort((a, b) => parseFloat(a) - parseFloat(b))

  const tieneExencion = tarifas.includes('0')

  tarifas.forEach(tarifa => {
    if (tarifa === '0') return

    const thCompras = document.createElement('th')
    const spanCompras = document.createElement('span')
    spanCompras.textContent = `Compras ${tarifa}%`
    thCompras.appendChild(spanCompras)
    thCompras.appendChild(TooltipFactory.create('info', 'Compras sin impuesto'))
    headerRow.appendChild(thCompras)

    const thIVA = document.createElement('th')
    const spanIVA = document.createElement('span')
    spanIVA.textContent = `IVA ${tarifa}%`
    thIVA.appendChild(spanIVA)
    thIVA.appendChild(TooltipFactory.create('info', 'Monto de impuesto'))
    headerRow.appendChild(thIVA)
  })

  if (tieneExencion) {
    const thExonerado = document.createElement('th')
    const spanExonerado = document.createElement('span')
    spanExonerado.textContent = 'Exento'
    thExonerado.appendChild(spanExonerado)
    thExonerado.appendChild(TooltipFactory.create('info', 'Ventas exoneradas de impuesto'))
    headerRow.appendChild(thExonerado)
  }

  const thTotalFinal = document.createElement('th')
  const spanTotalFinal = document.createElement('span')
  spanTotalFinal.textContent = 'TOTAL'
  thTotalFinal.appendChild(spanTotalFinal)
  thTotalFinal.appendChild(TooltipFactory.create('info', 'Total de todas las compras e impuestos'))
  thTotalFinal.style.backgroundColor = '#f0fdf4'
  thTotalFinal.style.color = 'var(--primary-dark)'
  thTotalFinal.style.fontWeight = '700'
  headerRow.appendChild(thTotalFinal)

  thead.appendChild(headerRow)

  const tbody = table.createTBody()
  const dataRow = document.createElement('tr')

  const tdFecha = document.createElement('td')
  tdFecha.textContent = fechaEmision
  dataRow.appendChild(tdFecha)

  const tdConsecutivo = document.createElement('td')
  tdConsecutivo.textContent = numeroConsecutivo
  tdConsecutivo.style.fontWeight = '600'
  dataRow.appendChild(tdConsecutivo)

  const tdProveedor = document.createElement('td')
  tdProveedor.textContent = proveedor
  dataRow.appendChild(tdProveedor)

  let totalGeneral = 0

  tarifas.forEach(tarifa => {
    if (tarifa === '0') return

    const tdCompras = document.createElement('td')
    tdCompras.textContent = listaImpuestos[tarifa].subtotalTarifa.toFixed(2)
    tdCompras.style.fontWeight = '600'
    dataRow.appendChild(tdCompras)

    const tdIVA = document.createElement('td')
    tdIVA.textContent = listaImpuestos[tarifa].impuestoTarifa.toFixed(2)
    tdIVA.style.fontWeight = '600'
    tdIVA.style.color = '#d97706'
    dataRow.appendChild(tdIVA)

    totalGeneral += listaImpuestos[tarifa].totalTarifa
  })

  if (tieneExencion) {
    const tdExonerado = document.createElement('td')
    tdExonerado.textContent = listaImpuestos['0'].subtotalTarifa.toFixed(2)
    tdExonerado.style.fontWeight = '600'
    dataRow.appendChild(tdExonerado)
    totalGeneral += listaImpuestos['0'].totalTarifa
  }

  const tdTotalFinal = document.createElement('td')
  tdTotalFinal.textContent = totalGeneral.toFixed(2)
  tdTotalFinal.style.fontWeight = '700'
  tdTotalFinal.style.backgroundColor = '#f0fdf4'
  tdTotalFinal.style.color = 'var(--primary-dark)'
  tdTotalFinal.style.fontSize = '14px'
  tdTotalFinal.style.padding = 'var(--spacing-md) var(--spacing-lg)'
  dataRow.appendChild(tdTotalFinal)

  tbody.appendChild(dataRow)
  return table
}

function buildInvoiceOptions (idFactura, tablaContenidos, descartarFactura) {
  const container = document.createElement('div')
  container.className = 'factura-options'

  const { wrapper } = CheckboxFactory.create(
    `check-${idFactura}`,
    'Incluir en Reporte',
    (event) => onCheckTable(event, { tabla: tablaContenidos, key: idFactura })
  )

  const btnDiscard = ButtonFactory.create(
    'Descartar Factura',
    'danger',
    'md',
    (event) => onDescartarFactura(event, idFactura, descartarFactura)
  )

  container.appendChild(wrapper)
  container.appendChild(btnDiscard)

  return container
}

function onCheckTable (event, obTabla) {
  const isChecked = event.target.checked
  if (!isChecked) {
    // Eliminar de CHECKED_TABLES
    const index = CHECKED_TABLES.findIndex(item => item.key === obTabla.key)
    if (index > -1) CHECKED_TABLES.splice(index, 1)
    return
  }
  CHECKED_TABLES.push(obTabla)
}

function onDescartarFactura (event, idFactura, descartarFactura) {
  event.preventDefault()

  // Remover de checked tables si está seleccionado
  const index = CHECKED_TABLES.findIndex(item => item.key === idFactura)
  if (index > -1) CHECKED_TABLES.splice(index, 1)

  // Llamar a la función callback para descartar la factura
  descartarFactura(idFactura)
}

// Lógica para fusionar las tablas seleccionadas en CHECKED_TABLES
function getTablaFusion () {
  if (CHECKED_TABLES.length === 0) return null
  const tablaFusion = document.createElement('table')

  // Obtener todas las columnas únicas
  const columnasSet = new Set()
  // Incluir todas las columnas de las tablas seleccionadas; Sin repeticiones
  CHECKED_TABLES.forEach(({ tabla }) => {
    tabla.querySelectorAll('thead th').forEach(th => {
      // Excluir columnas no deseadas
      if (th.textContent !== 'Incluir en Reporte') {
        columnasSet.add(th.textContent.trim())
      }
    })
  })

  // Convertir el Set a un Array para iterar y después ordenar las columnas segun el % de impuesto.
  const columnasTablaFusion = Array.from(columnasSet).sort((a, b) => {
    const impuestoA = parseFloat(a.match(/Ventas al (\d+)%/)?.[1] || '0')
    const impuestoB = parseFloat(b.match(/Ventas al (\d+)%/)?.[1] || '0')
    return impuestoA - impuestoB
  })

  // Crear encabezado de la tabla fusionada
  const thead = tablaFusion.createTHead()
  const trHead = document.createElement('tr')
  // Crear y añadir th para cada columna única
  columnasTablaFusion.forEach(col => {
    const th = document.createElement('th')
    th.textContent = col
    trHead.appendChild(th)
  })
  thead.appendChild(trHead)

  // Copiar filas de cada tabla seleccionada
  const tbody = tablaFusion.createTBody()
  CHECKED_TABLES.forEach(({ tabla }) => {
    // Obtener los encabezados de la tabla original
    const ths = Array.from(tabla.querySelectorAll('thead th')).map(th => th.textContent.trim())

    // Iterar sobre las filas de la tabla original
    tabla.querySelectorAll('tbody tr').forEach(fila => {
      const nuevaFila = document.createElement('tr')
      // Logica para copiar los datos de las filas que hagan match con las columnas; si no hay match, dejamos en blanco
      columnasTablaFusion.forEach(col => {
        const td = document.createElement('td')
        // Si la tabla tiene esta columna, copiar el valor; si no, dejar en blanco
        const index = ths.indexOf(col)
        td.textContent = index > -1 ? fila.children[index]?.textContent : ''
        nuevaFila.appendChild(td)
      })
      tbody.appendChild(nuevaFila)
    })
  })

  return tablaFusion
}

// Funcion para deseleccionar todas las tablas
function limpiarTablasSeleccionadas () {
  // Limpiar las tablas seleccionadas
  CHECKED_TABLES.length = 0

  // Desmarcar todos los checkboxes en la interfaz
  const checkboxes = document.querySelectorAll('input[type="checkbox"].btn-check')
  checkboxes.forEach(checkbox => {
    checkbox.checked = false
  })
}

// Funcion para seleccionar todas las tablas
function seleccionarTodasTablas () {
  // Limpiar las tablas seleccionadas
  limpiarTablasSeleccionadas()
  // Marcar todos los checkboxes en la interfaz y agregar a CHECKED_TABLES
  const checkboxes = document.querySelectorAll('input[type="checkbox"].btn-check')
  checkboxes.forEach(checkbox => {
    checkbox.checked = true
    const idFactura = checkbox.id.replace('check-', '')
    const tabla = checkbox.closest('.factura-container').querySelector('table')
    CHECKED_TABLES.push({ tabla, key: idFactura })
  })
}

export { getTablaFactura, getTablaFusion, limpiarTablasSeleccionadas, seleccionarTodasTablas }
