function crearFilterBetweenDates (callback) {
  const contenedorFilter = document.createElement('div')
  contenedorFilter.classList.add('filter-between-dates', 'd-flex', 'flex-column', 'gap-2', 'mt-2', 'mb-2', 'w-25')

  // Bolds
  const boldFechaInicio = document.createElement('b')
  boldFechaInicio.textContent = 'Fecha Inicio:'
  const boldFechaFin = document.createElement('b')
  boldFechaFin.textContent = 'Fecha Fin:'

  // Input fecha inicio
  const inputFechaInicio = document.createElement('input')
  inputFechaInicio.type = 'date'
  inputFechaInicio.classList.add('form-control', 'date-start-input')
  inputFechaInicio.setAttribute('placeholder', 'Fecha inicio')

  // Input fecha fin
  const inputFechaFin = document.createElement('input')
  inputFechaFin.type = 'date'
  inputFechaFin.classList.add('form-control', 'date-end-input')
  inputFechaFin.setAttribute('placeholder', 'Fecha fin')

  // Boton aplicar filtro
  const btnAplicarFiltro = document.createElement('button')
  btnAplicarFiltro.classList.add('btn', 'btn-primary', 'btn-apply-date-filter')
  btnAplicarFiltro.textContent = 'Aplicar Filtro'

  // Evento al hacer click en el boton de aplicar
  btnAplicarFiltro.addEventListener('click', () => {
    const fechaInicio = inputFechaInicio.value
    const fechaFin = inputFechaFin.value
    contenedorFilter.remove()
    // Llamar al callback con las fechas seleccionadas
    callback(fechaInicio, fechaFin)
  })

  // Boton descartar filtro
  const btnDescartarFiltro = document.createElement('button')
  btnDescartarFiltro.classList.add('btn', 'btn-secondary', 'btn-discard-date-filter')
  btnDescartarFiltro.textContent = 'Descartar Filtro'

  // Evento al hacer click en el boton de descartar
  btnDescartarFiltro.addEventListener('click', () => {
    contenedorFilter.remove()
    callback() // Indicar que se descarta el filtro
  })

  // Ensamblar el contenedor
  contenedorFilter.appendChild(boldFechaInicio)
  contenedorFilter.appendChild(inputFechaInicio)
  contenedorFilter.appendChild(boldFechaFin)
  contenedorFilter.appendChild(inputFechaFin)
  contenedorFilter.appendChild(btnAplicarFiltro)
  contenedorFilter.appendChild(btnDescartarFiltro)
  return contenedorFilter
}

export { crearFilterBetweenDates }
