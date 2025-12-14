import { CHECKED_TABLES } from '../config/constants.js'

function getTablaFactura (idFactura, dataFacturas = null, descartarFactura) {
  if (!dataFacturas || dataFacturas.length === 0) return 'No hay facturas para mostrar.'
  const { receptor, proveedor, fechaEmision, listaImpuestos, nombreArchivoXML } = dataFacturas
  // H5 Nombre archivo de la factura
  const h5nombreArchivo = document.createElement('h5')
  h5nombreArchivo.innerHTML = `<strong>Nombre archivo: </strong>${nombreArchivoXML}`
  h5nombreArchivo.classList.add('mb-2')

  // Contenedor principal del componente factura
  const contenedorFactura = document.createElement('div')
  contenedorFactura.classList.add('factura-container', 'mb-3', 'd-flex', 'flex-wrap', 'flex-column', 'overflow-scroll', 'align-items-start', 'border', 'p-3', 'rounded')

  // Contenedor de opciones de la factura
  const contenedorOpciones = document.createElement('div')
  contenedorOpciones.classList.add('factura-options', 'd-flex', 'flex-wrap', 'gap-2')

  // Generamos tabla de contenidos
  const tablaContenidos = document.createElement('table')
  tablaContenidos.classList.add('table-contents', 'table', 'table-bordered', 'mt-1')

  // Encabezados de la tabla de contenidos
  const tHeader = document.createElement('thead')
  const headerRow = document.createElement('tr')

  const thProveedor = document.createElement('th')
  thProveedor.textContent = 'NOMBRE PROVEEDOR'
  headerRow.appendChild(thProveedor)

  const thReceptor = document.createElement('th')
  thReceptor.textContent = 'NOMBRE RECEPTOR'
  headerRow.appendChild(thReceptor)

  const thFechaEmision = document.createElement('th')
  thFechaEmision.textContent = 'FECHA EMISIÓN'
  headerRow.appendChild(thFechaEmision)

  // Cuerpo de tabla de contenidos
  const tbody = document.createElement('tbody')

  // Mapeamos las filas y encabezados de la tabla de contenidos
  const dataRow = document.createElement('tr')

  // Nombre del proveedor
  const tdProveedor = document.createElement('td')
  tdProveedor.textContent = proveedor
  dataRow.appendChild(tdProveedor)

  // Nombre del receptor
  const tdReceptor = document.createElement('td')
  tdReceptor.textContent = receptor
  dataRow.appendChild(tdReceptor)

  // Fecha de emisión
  const tdFechaEmision = document.createElement('td')
  tdFechaEmision.textContent = fechaEmision
  dataRow.appendChild(tdFechaEmision)

  Object.entries(listaImpuestos).forEach(([tarifa, info]) => {
    // Encabezados
    const th = document.createElement('th')
    th.textContent = `Ventas al ${tarifa}%`
    headerRow.appendChild(th)

    // Datos
    const tdDataTotals = document.createElement('td')
    tdDataTotals.textContent = info.totalTarifa
    dataRow.appendChild(tdDataTotals)
    tbody.appendChild(dataRow)
  })

  // Crear checkbox para seleccion de tablas
  const checkTabla = document.createElement('input')
  checkTabla.type = 'checkbox'
  checkTabla.classList.add('btn-check')
  checkTabla.id = `check-${idFactura}`
  checkTabla.autocomplete = 'off'

  // Crear el label del checkbox
  const labelCheck = document.createElement('label')
  labelCheck.classList.add('btn', 'btn-outline-primary')
  labelCheck.setAttribute('for', `check-${idFactura}`)
  labelCheck.textContent = 'Incluir en Reporte'

  // Evento al seleccionar el checkbox
  checkTabla.addEventListener('change', (event) => { onCheckTable(event, { tabla: tablaContenidos, key: idFactura }) })

  // Crear boton para descartar la factura
  const btnDescartarFactura = document.createElement('input')
  btnDescartarFactura.type = 'button'
  btnDescartarFactura.classList.add('btn', 'btn-danger')
  btnDescartarFactura.id = `discard-${idFactura}`
  btnDescartarFactura.value = 'Descartar Factura'
  btnDescartarFactura.autocomplete = 'off'

  // Evento para descartar la factura
  btnDescartarFactura.addEventListener('click', (event) => { onDescartarFactura(event, idFactura, descartarFactura) })

  // Ensamblamos la tabla de contenidos
  tHeader.appendChild(headerRow)
  tablaContenidos.appendChild(tHeader)
  tablaContenidos.appendChild(tbody)

  // Agregamos el nombre del archivo al contenedor principal de la factura
  contenedorFactura.appendChild(h5nombreArchivo)

  // Agregar checkbox y label al contenedor de opciones
  contenedorOpciones.appendChild(checkTabla)
  contenedorOpciones.appendChild(labelCheck)

  // Agregar boton descartar al contenedor de opciones
  contenedorOpciones.appendChild(btnDescartarFactura)

  // Agregar contenedor de opciones al contenedor principal de la factura
  contenedorFactura.appendChild(contenedorOpciones)

  // Ensamblamos el contenedor de la factura
  contenedorFactura.appendChild(tablaContenidos)

  return contenedorFactura
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

export { getTablaFactura, getTablaFusion, limpiarTablasSeleccionadas }
