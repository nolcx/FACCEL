import { XMLParser } from 'fast-xml-parser'
import { getTableofContents, fusionarTablasSeleccionadas } from './data_extraction_logic.js'
import { exportarReporteExcel } from './export_table.js'

const main_container = document.getElementsByClassName('main-container')[0]

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
    main_container.appendChild(tablaContenidos)
  }
  reader.readAsText(file)
})

// Evento para exportar la tabla fusionada al hacer click en el botón
botonExportar.addEventListener('click', exportarTablaFusionada)

// Función para eventar la exportación de la tabla fusionada
function exportarTablaFusionada (e) {
  // Obtener la tabla fusionada
  const tablaFusionada = fusionarTablasSeleccionadas()
  // Exportar la tabla fusionada a Excel
  exportarReporteExcel(tablaFusionada)
}
