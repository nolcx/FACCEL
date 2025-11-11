import { XMLParser } from 'fast-xml-parser'
import { getTableofContents, fusionarTablasSeleccionadas } from './data_extraction_logic.js'
import { exportarReporteExcel } from './Utils/ExportTable.js'
import { getFilterBubble } from './Components/FilterBubble.js'
import { parseDate, isBetweenDates } from './Utils/DateOperations.js'

// Contenedor principal
const mainContainer = document.getElementsByClassName('main-container')[0]

// Lista de Facturas
const FACTURAS = []

// Obtener las opciones de filtrado
const filterDateOption = document.getElementsByClassName('filter-date-option')[0]
const filterBetweenDatesOption = document.getElementsByClassName('filter-between-date-option')[0]
const filterReceptorOption = document.getElementsByClassName('filter-receptor-option')[0]
const filterProviderOption = document.getElementsByClassName('filter-provider-option')[0]

// Filter Buttons
const btnFilterBetweenDates = document.getElementsByClassName('btn-filter-between-dates')[0]

// Contenedor de filtros
const filterBetweenDatesContainer = document.getElementsByClassName('filter-between-dates-container')[0]

// Inputs de filtro
const dateFilterInput = document.getElementsByClassName('date-filter-input')[0]

// Filter Bubble List Container
const filterBubbleList = document.getElementsByClassName('filter-bubble-list')[0]

const parser = new XMLParser()
const XMLFile = document.getElementsByClassName('xml_input_form')[0]
const botonExportar = document.getElementsByClassName('export-button')[0]

// Lectura del archivo XML al seleccionarlo
XMLFile.addEventListener('change', (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!file.name.endsWith('.xml')) return
  // Crear un FileReader para leer el contenido del archivo
  const reader = new FileReader()
  reader.onload = function (e) {
    const XMLContent = e.target.result
    const XMLParseado = parser.parse(XMLContent)
    // Obtener la tabla de contenidos generada; con la data extraida del XML importado
    const tablaContenidos = getTableofContents(XMLParseado)
    // Insertar la tabla de contenidos en el contenedor principal
    mainContainer.appendChild(tablaContenidos)
    FACTURAS.push(XMLParseado.FacturaElectronica)
  }
  reader.readAsText(file)
})

// Evento para exportar la tabla fusionada al hacer click en el botón
botonExportar.addEventListener('click', exportarTablaFusionada)

// Evento para filtrar por fecha
filterDateOption.addEventListener('click', () => {
  // Cambiamos el tipo de dato aceptado en el input file
  // PENDIENTE
  // Hacemos visible el input de fecha
  dateFilterInput.classList.remove('invisible')
})

filterBetweenDatesOption.addEventListener('click', () => {
  // Cambiamos el tipo de dato aceptado en el input file
  // PENDIENTE
  console.log('Filtrar entre fechas')
  filterBetweenDatesContainer.classList.remove('invisible')
})

btnFilterBetweenDates.addEventListener('click', () => {
  const fechaInicio = document.getElementsByClassName('date-filter-input-start')[0].value
  const fechaFin = document.getElementsByClassName('date-filter-input-end')[0].value
  console.log('Filtrando entre fechas:', fechaInicio, fechaFin)
  filterBetweenDatesContainer.classList.add('invisible')
  const facturasFiltradas = FACTURAS.filter((factura) => isBetweenDates(parseDate(factura.FechaEmision), parseDate(fechaInicio), parseDate(fechaFin)))
  console.log(facturasFiltradas)
})

// Evento para filtrar por receptor
filterReceptorOption.addEventListener('click', () => {
  // Cambiamos el tipo de dato aceptado en el input file
  // PENDIENTE
  console.log('Filtrar por receptor')
})

// Evento para filtrar por proveedor
filterProviderOption.addEventListener('click', () => {
  // Cambiamos el tipo de dato aceptado en el input file
  // PENDIENTE
  console.log('Filtrar por proveedor')
})

dateFilterInput.addEventListener('change', (event) => {
  const selectedDate = event.target.value
  console.log('Fecha seleccionada:', selectedDate)
  dateFilterInput.classList.add('invisible')
  // Crear y agregar el filter bubble
  const filterBubble = getFilterBubble('date', selectedDate)
  filterBubbleList.appendChild(filterBubble)
  console.log(filtrarPorFecha(selectedDate))
})

// Filtrar por fecha
function filtrarPorFecha (fecha) {
  console.log('Filtrando por fecha:', fecha)
  const facturasFiltradas = FACTURAS.filter((factura) => parseDate(factura.FechaEmision) === parseDate(fecha))
  return facturasFiltradas
}

// Función para eventar la exportación de la tabla fusionada
function exportarTablaFusionada (e) {
  // Obtener la tabla fusionada
  const tablaFusionada = fusionarTablasSeleccionadas()
  // Exportar la tabla fusionada a Excel
  exportarReporteExcel(tablaFusionada)
}
