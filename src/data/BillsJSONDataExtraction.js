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
        if (!acc[impuesto]) acc[impuesto] = { servicios: [], subtotalTarifa: 0, descuentoTarifa: 0, impuestoTarifa: 0, totalTarifa: 0 }

        // El SubTotal del XML ya viene con el descuento restado, asi que el
        // bruto se reconstruye sumandolo de vuelta.
        const descuento = getMontoDescuento(detalle)

        // Sumar compras brutas (sin impuesto y antes del descuento)
        const SumaSubtotal = parseFloat(acc[impuesto].subtotalTarifa) + (detalle?.SubTotal || 0) + descuento

        // Sumar descuentos
        const SumaDescuento = parseFloat(acc[impuesto].descuentoTarifa) + descuento

        // Sumar impuesto
        const SumaImpuesto = parseFloat(acc[impuesto].impuestoTarifa) + (detalle?.Impuesto?.Monto || 0)

        // Sumar el monto total de la línea (subtotal + impuesto)
        const SumaTarifaTotal = parseFloat(acc[impuesto].totalTarifa) + (detalle?.MontoTotalLinea)

        acc[impuesto].servicios.push(detalle)
        acc[impuesto].subtotalTarifa = SumaSubtotal
        acc[impuesto].descuentoTarifa = SumaDescuento
        acc[impuesto].impuestoTarifa = SumaImpuesto
        acc[impuesto].totalTarifa = SumaTarifaTotal

        return acc
      }, {})

      // Total de otros cargos
      let TotalOtrosCargos = getMontoOtrosCargos(documento)

      // Total exonerado
      let TotalExonerado = documento.ResumenFactura?.TotalExonerado || 0

      // Subtotal (total venta sin impuestos)
      let Subtotal = documento.ResumenFactura?.TotalVenta || 0

      // Si es nota de crédito, los valores son negativos
      if (esNotaCredito) {
        Subtotal = -Subtotal
        TotalExonerado = -TotalExonerado
        TotalOtrosCargos = -TotalOtrosCargos
        // Invertir los signos en listaImpuestos
        Object.keys(listaImpuestos).forEach(tarifa => {
          listaImpuestos[tarifa].subtotalTarifa = -listaImpuestos[tarifa].subtotalTarifa
          listaImpuestos[tarifa].descuentoTarifa = -listaImpuestos[tarifa].descuentoTarifa
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
        totalOtrosCargos: TotalOtrosCargos,
        nombreArchivoXML
      }

      resolve(dataFacturas)
    } catch (error) {
      reject(error)
    }
  })
}

// Una linea puede traer un descuento, varios, o ninguno.
function getMontoDescuento (detalle) {
  const descuentos = detalle?.Descuento
  if (!descuentos) return 0
  const lista = Array.isArray(descuentos) ? descuentos : [descuentos]
  return lista.reduce((suma, descuento) => suma + (descuento?.MontoDescuento || 0), 0)
}

// El documento puede traer un OtrosCargos, varios, o ninguno.
function getMontoOtrosCargos (documento) {
  const cargos = documento?.OtrosCargos
  if (!cargos) return 0
  const lista = Array.isArray(cargos) ? cargos : [cargos]
  return lista.reduce((suma, cargo) => suma + (cargo?.MontoCargo || 0), 0)
}

export { getDataFactura }
