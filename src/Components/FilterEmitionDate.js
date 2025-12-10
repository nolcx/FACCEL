function crearFilterEmitionDate (callback) {
  const contenedorFilter = document.createElement('div')
  contenedorFilter.classList.add('filter-emition-date', 'd-flex', 'flex-column', 'gap-2', 'mt-2', 'mb-2', 'w-25')

  // Bold
  const boldFechaEmision = document.createElement('b')
  boldFechaEmision.textContent = 'Fecha Emisión:'

  // Input fecha emisión
  const inputFechaEmision = document.createElement('input')
  inputFechaEmision.type = 'date'
  inputFechaEmision.classList.add('form-control', 'emition-date-input')
  inputFechaEmision.setAttribute('placeholder', 'Fecha emisión')

  // Boton aplicar filtro
  const btnAplicarFiltro = document.createElement('button')
  btnAplicarFiltro.classList.add('btn', 'btn-primary', 'btn-apply-emition-date-filter')
  btnAplicarFiltro.textContent = 'Aplicar Filtro'
  // Evento al hacer click en el boton de aplicar
  btnAplicarFiltro.addEventListener('click', () => {
    const fechaEmision = inputFechaEmision.value
    contenedorFilter.remove()
    // Llamar al callback con la fecha seleccionada
    callback(fechaEmision)
  })

  // Boton descartar filtro
  const btnDescartarFiltro = document.createElement('button')
  btnDescartarFiltro.classList.add('btn', 'btn-secondary', 'btn-discard-emition-date-filter')
  btnDescartarFiltro.textContent = 'Descartar Filtro'

  // Evento al hacer click en el boton de descartar
  btnDescartarFiltro.addEventListener('click', () => {
    contenedorFilter.remove()
    callback() // Indicar que se descarta el filtro
  })

  // Ensamblar el contenedor
  contenedorFilter.appendChild(boldFechaEmision)
  contenedorFilter.appendChild(inputFechaEmision)
  contenedorFilter.appendChild(btnAplicarFiltro)
  contenedorFilter.appendChild(btnDescartarFiltro)
  return contenedorFilter
}

export { crearFilterEmitionDate }
