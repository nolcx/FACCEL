import { parseDate } from '../utils/DateOperations.js'

function getDataFactura ({ XMLParseado, nombreArchivoXML = 'Archivo Desconocido' }) {
  return new Promise((resolve, reject) => {
    try {
      console.log(XMLParseado)
      if (!XMLParseado) reject(new Error('No se ha proporcionado un XML válido.'))
      if (XMLParseado.MensajeHacienda) reject(new Error('El archivo proporcionado es una Respuesta de Hacienda.'))
      if (XMLParseado.TiqueteElectronico) reject(new Error('El archivo proporcionado es un Tiquete Electrónico.'))
      if (XMLParseado.NotaDebitoElectronica) reject(new Error('El archivo proporcionado es una Nota de Débito Electrónica.'))

      // Detectar si es Nota de Crédito
      const esNotaCredito = !!XMLParseado.NotaCreditoElectronica
      if (!esNotaCredito && !XMLParseado.FacturaElectronica) reject(new Error('El archivo proporcionado no es válido.'))

      const documento = esNotaCredito ? XMLParseado.NotaCreditoElectronica : XMLParseado.FacturaElectronica
      const proveedor = documento.Emisor?.NombreComercial || documento.Emisor?.Nombre || 'Proveedor Desconocido'
      const receptor = documento.Receptor?.Nombre || 'Receptor Desconocido'
      const fechaEmision = parseDate(documento.FechaEmision) || 'Fecha Desconocida'
      const numeroConsecutivo = documento.NumeroConsecutivo || 'N/A'

      // Obtener la lista de servicios
      let listaServicios = documento.DetalleServicio?.LineaDetalle

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
        if (!acc[impuesto]) acc[impuesto] = { servicios: [], subtotalTarifa: 0, impuestoTarifa: 0, totalTarifa: 0 }

        // Sumar subtotal (sin impuesto)
        const SumaSubtotal = parseFloat(acc[impuesto].subtotalTarifa) + (detalle?.SubTotal || 0)

        // Sumar impuesto
        const SumaImpuesto = parseFloat(acc[impuesto].impuestoTarifa) + (detalle?.Impuesto?.Monto || 0)

        // Sumar el monto total de la línea (subtotal + impuesto)
        const SumaTarifaTotal = parseFloat(acc[impuesto].totalTarifa) + (detalle?.MontoTotalLinea)

        acc[impuesto].servicios.push(detalle)
        acc[impuesto].subtotalTarifa = SumaSubtotal
        acc[impuesto].impuestoTarifa = SumaImpuesto
        acc[impuesto].totalTarifa = SumaTarifaTotal

        return acc
      }, {})

      // Total de otros cargos
      const TotalOtrosCargos = documento.ResumenFactura?.TotalOtrosCargos || 0

      // Total exonerado
      let TotalExonerado = documento.ResumenFactura?.TotalExonerado || 0

      // Subtotal (total venta sin impuestos)
      let Subtotal = documento.ResumenFactura?.TotalVenta || 0

      // Si es nota de crédito, los valores son negativos
      if (esNotaCredito) {
        Subtotal = -Subtotal
        TotalExonerado = -TotalExonerado
        // Invertir los signos en listaImpuestos
        Object.keys(listaImpuestos).forEach(tarifa => {
          listaImpuestos[tarifa].subtotalTarifa = -listaImpuestos[tarifa].subtotalTarifa
          listaImpuestos[tarifa].impuestoTarifa = -listaImpuestos[tarifa].impuestoTarifa
          listaImpuestos[tarifa].totalTarifa = -listaImpuestos[tarifa].totalTarifa
        })
      }

      const dataFacturas = {
        tipo: esNotaCredito ? 'NotaCredito' : 'Factura',
        receptor,
        proveedor,
        fechaEmision,
        numeroConsecutivo,
        listaImpuestos,
        subtotal: Subtotal,
        totalExonerado: TotalExonerado,
        totalOtrosCargos: TotalOtrosCargos > 0 ? -TotalOtrosCargos : null,
        nombreArchivoXML
      }

      resolve(dataFacturas)
    } catch (error) {
      reject(error)
    }
  })
}

export { getDataFactura }
