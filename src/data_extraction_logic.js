function getTableofContents(data) {
  const { FacturaElectronica } = data || {};
  
  const listaServicios =  structuredClone(FacturaElectronica?.DetalleServicio?.LineaDetalle) || []
  // Separamos los servicios por tarifa de impuesto
  const listaImpuestos = listaServicios.reduce((acc, servicio) => {
    const impuesto = servicio?.Impuesto?.Tarifa || []
    if (!acc[impuesto]) acc[impuesto] = []
    acc[impuesto].push(servicio)
    return acc
  }, {})
  return listaImpuestos;
} 


export { getTableofContents }