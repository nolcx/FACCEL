import { parseDate } from '../utils/DateOperations.js'

function getDataFactura (DATA, nombreArchivoXML = 'Archivo Desconocido') {
  if (!DATA) return null

  const { FacturaElectronica } = DATA || {}
  const proveedor = FacturaElectronica?.Emisor?.NombreComercial || 'Proveedor Desconocido'
  const receptor = FacturaElectronica?.Receptor?.Nombre || 'Receptor Desconocido'
  const fechaEmision = parseDate(FacturaElectronica.FechaEmision) || 'Fecha Desconocida'
  const listaServicios = structuredClone(FacturaElectronica?.DetalleServicio?.LineaDetalle) || []

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

  const dataFacturas = { receptor, proveedor, fechaEmision, listaImpuestos, nombreArchivoXML }
  return dataFacturas
}

export { getDataFactura }
