import { parseDate } from '../utils/DateOperations.js'

function getDataFactura ({ XMLParseado, nombreArchivoXML = 'Archivo Desconocido' }) {
  return new Promise((resolve, reject) => {
    try {
      if (!XMLParseado) return resolve(null)

      const { FacturaElectronica } = XMLParseado || {}
      const proveedor = FacturaElectronica?.Emisor?.NombreComercial || 'Proveedor Desconocido'
      const receptor = FacturaElectronica?.Receptor?.Nombre || 'Receptor Desconocido'
      const fechaEmision = parseDate(FacturaElectronica.FechaEmision) || 'Fecha Desconocida'

      // Obtener la lista de servicios
      let listaServicios = FacturaElectronica?.DetalleServicio?.LineaDetalle

      // Asegurarse de que listaServicios sea un array
      if (!Array.isArray(listaServicios)) {
        // Si es un solo objeto, convertirlo en un array (de un solo elemento, si existe)
        listaServicios = listaServicios ? [listaServicios] : []
      }

      // Clonar la lista de servicios para evitar mutaciones
      listaServicios = structuredClone(listaServicios)

      // Separamos los detalles por tarifa de impuesto
      const listaImpuestos = listaServicios.reduce((acc, detalle) => {
        // Linea de impuesto del detalle
        const impuesto = detalle?.Impuesto?.Tarifa || 0

        // Verificar si ya existe la tarifa de impuesto en el acumulador
        if (!acc[impuesto]) acc[impuesto] = { servicios: [], totalTarifa: 0 }

        // Sumar el monto total de la línea al total de tarifa del impuesto
        const SumaTarifaTotal =
          parseFloat(acc[impuesto].totalTarifa) + (detalle?.MontoTotalLinea)

        acc[impuesto].servicios.push(detalle)
        acc[impuesto].totalTarifa = SumaTarifaTotal

        return acc
      }, {})

      // Total de otros cargos
      const TotalOtrosCargos = FacturaElectronica?.ResumenFactura?.TotalOtrosCargos || 0

      const dataFacturas = {
        receptor,
        proveedor,
        fechaEmision,
        listaImpuestos,
        totalOtrosCargos: TotalOtrosCargos > 0 ? TotalOtrosCargos : null,
        nombreArchivoXML
      }

      resolve(dataFacturas)
    } catch (error) {
      reject(error)
    }
  })
}

export { getDataFactura }
