import { XMLParser } from 'fast-xml-parser'
import { getTableofContents, fusionarTablasSeleccionadas } from './data_extraction_logic.js'
import { exportarReporteExcel } from './export_table.js'
import { getFilterBubble } from './FilterBubble.js'

const mainContainer = document.getElementsByClassName('main-container')[0]

// Obtener las opciones de filtrado
const filterDateOption = document.getElementsByClassName('filter-date-option')[0]
const filterReceptorOption = document.getElementsByClassName('filter-receptor-option')[0]
const filterProviderOption = document.getElementsByClassName('filter-provider-option')[0]

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
  // Crear un FileReader para leer el contenido del archivo
  const reader = new FileReader()
  reader.onload = function (e) {
    const content = e.target.result
    const result = parser.parse(content)
    // Obtener la tabla de contenidos generada; con la data extraida del XML importado
    const tablaContenidos = getTableofContents(result)
    // Insertar la tabla de contenidos en el contenedor principal
    mainContainer.appendChild(tablaContenidos)
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
})

// Función para eventar la exportación de la tabla fusionada
function exportarTablaFusionada (e) {
  // Obtener la tabla fusionada
  const tablaFusionada = fusionarTablasSeleccionadas()
  // Exportar la tabla fusionada a Excel
  exportarReporteExcel(tablaFusionada)
}
