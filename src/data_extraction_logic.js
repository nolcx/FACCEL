function getTableofContents(DATA) {
  const { FacturaElectronica } = DATA || {}
  const proveedor = FacturaElectronica?.Emisor?.NombreComercial || 'Proveedor Desconocido'
  const listaServicios =  structuredClone(FacturaElectronica?.DetalleServicio?.LineaDetalle) || []
  
  // Separamos los detalles por tarifa de impuesto
  const listaImpuestos = listaServicios.reduce((acc, detalle) => {
    // Linea de impuesto del detalle
    const impuesto = detalle?.Impuesto?.Tarifa || {}

    // Verificar si ya existe la tarifa de impuesto en el acumulador
    if (!acc[impuesto]) acc[impuesto] = { servicios: [], totalTarifa: 0 }

    // Sumar el monto total de la línea al total de tarifa del impuesto
    const SumaTarifaTotal = parseFloat(acc[impuesto].totalTarifa) + (detalle?.MontoTotalLinea)
    acc[impuesto].servicios.push(detalle)
    acc[impuesto].totalTarifa = SumaTarifaTotal
    
    return acc
  }, {})

  // Generamos tabla de contenidos
  const tablaContenidos = document.createElement('table')
  tablaContenidos.classList.add('table-contents', 'table', 'table-bordered', 'mt-4')

  // Encabezados de la tabla de contenidos
  const tHeader = document.createElement('thead')
  const headerRow = document.createElement('tr')

  const th = document.createElement('th')
  th.textContent = "NOMBRE PROVEEDOR"
  headerRow.appendChild(th)
 
  // Cuerpo de tabla de contenidos
  const tbody = document.createElement('tbody')

  // Mapeamos las filas y encabezados de la tabla de contenidos
  const dataRow = document.createElement('tr')

  // Nombre del proveedor
  const tdProveedor = document.createElement('td')
  tdProveedor.textContent = proveedor
  dataRow.appendChild(tdProveedor)

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
  tHeader.appendChild(headerRow)
  tablaContenidos.appendChild(tHeader)
  tablaContenidos.appendChild(tbody)

  return tablaContenidos
}


export { getTableofContents }