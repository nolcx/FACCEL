/* global FileReader */
import { XMLParser } from 'https://esm.sh/fast-xml-parser@4.3.5'
import { ErrorToasty, InfoToasty, SuccessToasty, WarningToasty } from './components/Toastifys.js'
import { getDataFactura } from './data/BillsJSONDataExtraction.js'
import { getTablaFactura, getTablaFusion, limpiarTablasSeleccionadas, seleccionarTodasTablas } from './components/BillsTable.js'
import { exportarReporteExcel } from './utils/ExportTable.js'
import { getFilterBubble } from './components/FilterBubble.js'
import { crearCustomDropdown } from './components/CustomDropDown.js'
import { crearFilterBetweenDates } from './components/FilterBetweenDates.js'
import { crearFilterEmitionDate } from './components/FilterEmitionDate.js'
import { parseDate, isSameDate, isBetweenDates } from './utils/DateOperations.js'

// Importar constantes
import { FACTURAS, CHECKED_TABLES, FILTROS, TIPOS_FILTROS, TIPOS_FILTER_BUBBLES } from './config/constants.js'

// Contador global de facturas
let contadorGlobal = 0

// Contenedor de herramientas
const toolKitContainer = document.getElementsByClassName('toolkit-container')[0]

// Contenedor de las tablas de facturas
const billsContainer = document.getElementsByClassName('bills-container')[0]

// Filter Bubble List Container
const filterBubbleList = document.getElementsByClassName('filter-bubble-list')[0]

// Obtener las opciones de filtrado
const filterDateOption = document.getElementsByClassName('filter-date-option')[0]
const filterBetweenDatesOption = document.getElementsByClassName('filter-between-date-option')[0]
const filterReceptorOption = document.getElementsByClassName('filter-receptor-option')[0]
const filterProviderOption = document.getElementsByClassName('filter-provider-option')[0]

// Obtener el boton de exportar
const botonExportar = document.getElementsByClassName('export-button')[0]

// Boton para seleccionar todas las facturas
const botonSeleccionarTodasFacturas = document.getElementsByClassName('bills-select-all-button')[0]

// Boton para limpiar las facturas selecciones
const botonLimpiarSeleccionFacturas = document.getElementsByClassName('bills-clear-selection-button')[0]

// Obtener el input de archivo XML
const XMLFile = document.getElementsByClassName('xml_input_form')[0]

// Crear el parser de XML a JSON
const xmlParser = new XMLParser()

// Lectura del archivo XML al seleccionarlo
XMLFile.addEventListener('change', (event) => {
  const file = event.target.files[0]
  if (!file) return
  // Validar que el archivo tenga extensión .xml
  if (!file.name.endsWith('.xml')) return WarningToasty(`El archivo ${file.name} no es un archivo XML, verifique e intente nuevamente.`)
  // Crear un FileReader para leer el contenido del archivo
  const reader = new FileReader()
  reader.onload = function (e) {
    const XMLContent = e.target.result
    const XMLParseado = xmlParser.parse(XMLContent)
    // Nombre archivo
    const nombreArchivoXML = file.name
    // Parsear la data del XML relacionada a la factura
    getDataFactura({ XMLParseado, nombreArchivoXML }).then((dataFactura) => {
      if (!dataFactura) return WarningToasty(`No se pudo extraer la información de la factura del archivo ${nombreArchivoXML}.`)

      // Obtener el id de la factura
      const idFactura = getIdFactura()
      // Obtener la tabla de contenidos generada; con la data extraida del XML importado
      const tablaFactura = getTablaFactura(idFactura, dataFactura, descartarFactura)

      // Guardar la factura en la lista de facturas
      const factura = {
        idFactura,
        dataFactura: XMLParseado.FacturaElectronica,
        tablaFactura
      }
      FACTURAS.push(factura)

      // Renderizar las tablas de las facturas
      renderTablasFacturas()
      return dataFactura
    }).catch((error) => {
      // Si el error contiene undefined, es probable que el XML esté mal formado
      if (error.message.includes('undefined')) {
        return ErrorToasty(
          'Este archivo parece no contar con el formato XML válido.\n\n' +
          '👉 POR FAVOR, verifique que no sea una FIRMA DE HACIENDA e intente nuevamente.'
        )
      }
      ErrorToasty(`Hubo un error al extraer la información del archivo: ${error.message}`)
    })
  }
  reader.readAsText(file)
})

// Evento para exportar la tabla fusionada al hacer click en el botón
botonExportar.addEventListener('click', exportarTablaFusionada)

// Evento para seleccionar todas las facturas
botonSeleccionarTodasFacturas.addEventListener('click', () => {
  if (FACTURAS.length === 0) return WarningToasty('Aún no hay facturas para seleccionar.')
  // Seleccionar todas las tablas de facturas visibles
  seleccionarTodasTablas()
  // Notificar al usuario
  SuccessToasty(`Se han seleccionado ${CHECKED_TABLES.length} factura(s) para exportar.`)
})

// Evento para limpiar las facturas seleccionadas
botonLimpiarSeleccionFacturas.addEventListener('click', () => {
  if (CHECKED_TABLES.length === 0) return WarningToasty('Aún no hay facturas seleccionadas.')
  // Limpiar las tablas seleccionadas
  limpiarTablasSeleccionadas()
  // Notificar al usuario
  SuccessToasty('Se han limpiado las facturas seleccionadas.')
})

// Evento para filtrar por fecha
filterDateOption.addEventListener('click', () => {
  // Crear el componente de filtro por fecha
  const filterEmitionDateComponent = crearFilterEmitionDate((fecha) => filtrarPorFecha(fecha))
  // Mostrar el componente en pantalla
  toolKitContainer.appendChild(filterEmitionDateComponent)
})

// Evento para filtrar entre fechas
filterBetweenDatesOption.addEventListener('click', () => {
  // Crear el componente de filtro entre fechas
  const filterBetweenDatesComponent = crearFilterBetweenDates((fechaInicio, fechaFin) => filtrarPorRangoFechas(fechaInicio, fechaFin))
  // Mostrar el componente en pantalla
  toolKitContainer.appendChild(filterBetweenDatesComponent)
})

// Evento para filtrar por receptor
filterReceptorOption.addEventListener('click', () => {
  // Obtener la lista de receptores únicos
  const receptores = getReceptores()
  // Crear el dropdown de receptores
  const dropdownReceptores = crearCustomDropdown(receptores, (seleccionado) => filtrarPorReceptor(seleccionado))
  // Mostrar el dropdown en pantalla
  toolKitContainer.appendChild(dropdownReceptores)
})

// Evento para filtrar por proveedor
filterProviderOption.addEventListener('click', () => {
  const proveedores = getProveedores()
  // Crear el dropdown de proveedores
  const dropdownProveedores = crearCustomDropdown(proveedores, (seleccionado) => filtrarPorProveedor(seleccionado))
  // Mostrar el dropdown en pantalla
  toolKitContainer.appendChild(dropdownProveedores)
})

// Funcion para obtener el id de factura
function getIdFactura () {
  contadorGlobal += 1
  return `factura-${contadorGlobal}`
}

// Funcion para obtener el id de filtro
function getIdFiltro () {
  contadorGlobal += 1
  return `filtro-${contadorGlobal}`
}

// Función para limpiar y renderizar las tablas de las facturas en el contenedor de facturas
function renderTablasFacturas (facturas = FACTURAS) {
  billsContainer.innerHTML = ''
  facturas.forEach((factura) => {
    billsContainer.appendChild(factura.tablaFactura)
  })

  // Mostrar el header de la lista de facturas si hay facturas
  if (facturas.length === 0) {
    document.getElementsByClassName('header-list-bills')[0].classList.add('d-none')
  } else {
    document.getElementsByClassName('header-list-bills')[0].classList.remove('d-none')
  }
}

// Funcion para descartar una factura por identificador
function descartarFactura (idFactura) {
  if (!idFactura) return
  const indexFactura = FACTURAS.findIndex(factura => factura.idFactura === idFactura)
  FACTURAS.splice(indexFactura, 1)
  renderTablasFacturas()
}

function descartarFiltro (idFiltro) {
  const indexFiltro = FILTROS.findIndex(filtro => filtro.idFiltro === idFiltro)
  FILTROS.splice(indexFiltro, 1)
  if (FILTROS.length === 0) {
    // Ocultar el header de filter bubbles
    document.getElementsByClassName('header-filter-list')[0].classList.add('d-none')
    // Renderizar todas las facturas
    renderTablasFacturas()
    return
  }
  const facturasFiltradas = getFacturasFiltradas()
  renderTablasFacturas(facturasFiltradas)
}

function onFiltroAgregado () {
  const facturasFiltradas = getFacturasFiltradas()

  // Si hay tablas seleccionadas, limpiarlas
  if (CHECKED_TABLES.length > 0) {
    // Limpiar las tablas seleccionadas
    limpiarTablasSeleccionadas()
    InfoToasty('Se han limpiado las tablas seleccionadas debido a la aplicación de nuevos filtros.')
  }

  // Mostrar el header de filter bubbles
  document.getElementsByClassName('header-filter-list')[0].classList.remove('d-none')
  renderTablasFacturas(facturasFiltradas)
  InfoToasty(`${facturasFiltradas.length} factura(s) encontrada(s) con los filtros aplicados.`)
}

// Filtrar por fecha
function filtrarPorFecha (fecha) {
  if (!fecha) return
  const idFiltro = getIdFiltro()

  // Mostrar y agregar el filter bubble
  const filterBubble = getFilterBubble(TIPOS_FILTER_BUBBLES.FECHA, fecha, descartarFiltro, idFiltro)
  filterBubbleList.appendChild(filterBubble)

  // Crear el filtro y agregarlo a la lista de filtros
  const filtro = {
    idFiltro,
    tipo: TIPOS_FILTROS.FECHA,
    valor: fecha
  }
  FILTROS.push(filtro)
  onFiltroAgregado()
}

// Filtrar las facturas por rango de fechas
function filtrarPorRangoFechas (fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) return
  const idFiltro = getIdFiltro()

  // Mostrar y agregar el filter bubble
  const filterBubble = getFilterBubble(TIPOS_FILTER_BUBBLES.ENTRE_FECHAS, `${fechaInicio} - ${fechaFin}`, descartarFiltro, idFiltro)
  filterBubbleList.appendChild(filterBubble)

  // Crear el filtro y agregarlo a la lista de filtros
  const filtro = {
    idFiltro,
    tipo: TIPOS_FILTROS.ENTRE_FECHAS,
    valor: {
      inicio: fechaInicio,
      fin: fechaFin
    }
  }
  FILTROS.push(filtro)

  onFiltroAgregado()
}

// Filtrar las facturas por proveedor
function filtrarPorProveedor (nombreProveedor) {
  const idFiltro = getIdFiltro()
  // Mostrar y agregar el filter bubble
  const filterBubble = getFilterBubble(TIPOS_FILTER_BUBBLES.PROVEEDOR, nombreProveedor, descartarFiltro, idFiltro)
  filterBubbleList.appendChild(filterBubble)

  // Crear el filtro y agregarlo a la lista de filtros
  const filtro = {
    idFiltro,
    tipo: TIPOS_FILTROS.PROVEEDOR,
    valor: nombreProveedor
  }
  FILTROS.push(filtro)
  onFiltroAgregado()
}

// Filtrar las facturas por receptor
function filtrarPorReceptor (nombreReceptor) {
  const idFiltro = getIdFiltro()

  // Mostrar y agregar el filter bubble
  const filterBubble = getFilterBubble(TIPOS_FILTER_BUBBLES.RECEPTOR, nombreReceptor, descartarFiltro, idFiltro)
  filterBubbleList.appendChild(filterBubble)

  // Crear el filtro y agregarlo a la lista de filtros
  const filtro = {
    idFiltro,
    tipo: TIPOS_FILTROS.RECEPTOR,
    valor: nombreReceptor
  }
  FILTROS.push(filtro)
  onFiltroAgregado()
}

// Función para obtener las facturas filtradas según los filtros aplicados
function getFacturasFiltradas (filtros = FILTROS, facturas = FACTURAS) {
  const facturasFiltradas = []
  filtros.forEach((filtro) => {
    switch (filtro.tipo) {
      case TIPOS_FILTROS.FECHA:
        facturas.forEach((factura) => {
          if (isSameDate(parseDate(factura.dataFactura.FechaEmision), filtro.valor)) {
            // Verificar si la factura ya está en la lista de facturas filtradas
            if (!facturasFiltradas.includes(factura)) {
              facturasFiltradas.push(factura)
            }
          }
        })
        break
      case TIPOS_FILTROS.ENTRE_FECHAS:
        facturas.forEach((factura) => {
          if (isBetweenDates(parseDate(factura.dataFactura.FechaEmision), parseDate(filtro.valor.inicio), parseDate(filtro.valor.fin))) {
            // Verificar si la factura ya está en la lista de facturas filtradas
            if (!facturasFiltradas.includes(factura)) {
              facturasFiltradas.push(factura)
            }
          }
        })
        break
      case TIPOS_FILTROS.RECEPTOR:
        facturas.forEach((factura) => {
          if (factura.dataFactura.Receptor.Nombre === filtro.valor) {
            // Verificar si la factura ya está en la lista de facturas filtradas
            if (!facturasFiltradas.includes(factura)) {
              facturasFiltradas.push(factura)
            }
          }
        })
        break
      case TIPOS_FILTROS.PROVEEDOR:
        facturas.forEach((factura) => {
          if (factura.dataFactura.Emisor.NombreComercial === filtro.valor) {
            // Verificar si la factura ya está en la lista de facturas filtradas
            if (!facturasFiltradas.includes(factura)) {
              facturasFiltradas.push(factura)
            }
          }
        })
        break
      default:
        break
    }
  })

  return facturasFiltradas
}

// Función para obtener la lista de provedores únicos de las facturas
function getProveedores (facturas = FACTURAS) {
  // Utilizamos un Set para evitar nombres duplicados
  const proveedores = new Set()
  facturas.forEach((factura) => {
    proveedores.add(factura.dataFactura.Emisor.NombreComercial)
  })

  // Enviamos el Set convertido a Array
  return Array.from(proveedores)
}

// Función para obtener la lista de receptores únicos de las facturas
function getReceptores (facturas = FACTURAS) {
  // Utilizamos un Set para evitar nombres duplicados
  const receptores = new Set()
  facturas.forEach((factura) => {
    receptores.add(factura.dataFactura.Receptor.Nombre)
  })

  // Enviamos el Set convertido a Array
  return Array.from(receptores)
}

// Función para eventar la exportación de la tabla fusionada
function exportarTablaFusionada (e) {
  e.preventDefault()
  // Validar si el componente es null (es decir, no hay tablas seleccionadas)
  if (!getTablaFusion()) return WarningToasty('No hay facturas seleccionadas para exportar.')
  // Obtener la tabla fusionada
  const tablaFusionada = getTablaFusion()
  // Exportar la tabla fusionada a Excel
  exportarReporteExcel(tablaFusionada)
  return SuccessToasty('Reporte exportado exitosamente.')
}
