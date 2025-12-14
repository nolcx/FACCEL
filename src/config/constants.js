// Lista de Facturas
const FACTURAS = []

// Lista de tablas seleccionadas para exportar
const CHECKED_TABLES = []

// Lista de Filtros
const FILTROS = []

// Tipos de filtros disponibles
const TIPOS_FILTROS = {
  FECHA: 'fecha',
  ENTRE_FECHAS: 'entre_fechas',
  RECEPTOR: 'receptor',
  PROVEEDOR: 'proveedor'
}

const TIPOS_FILTER_BUBBLES = {
  FECHA: 'date',
  ENTRE_FECHAS: 'between-dates',
  RECEPTOR: 'receptor',
  PROVEEDOR: 'provider'
}

export {
  FACTURAS,
  CHECKED_TABLES,
  FILTROS,
  TIPOS_FILTROS,
  TIPOS_FILTER_BUBBLES
}
