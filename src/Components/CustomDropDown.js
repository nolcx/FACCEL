function crearCustomDropdown (elements, callback) {
  if (!Array.isArray(elements) || elements.length === 0) return null

  const contenedorDropdown = document.createElement('div')
  contenedorDropdown.classList.add('dropdown', 'mt-2')

  // Crear boton del dropdown
  const botonDropdown = document.createElement('button')
  botonDropdown.classList.add('btn', 'btn-secondary', 'dropdown-toggle')
  botonDropdown.setAttribute('type', 'button')
  botonDropdown.setAttribute('data-bs-toggle', 'dropdown')
  botonDropdown.setAttribute('aria-expanded', 'false')
  botonDropdown.textContent = 'Seleccionar opción:'

  // Se agrega el boton al contenedor
  contenedorDropdown.appendChild(botonDropdown)

  // Crear menu del dropdown
  const menuDropdown = document.createElement('ul')
  menuDropdown.classList.add('dropdown-menu')

  elements.forEach(element => {
    const itemDropdown = document.createElement('li')
    const enlaceDropdown = document.createElement('a')
    enlaceDropdown.classList.add('dropdown-item')
    enlaceDropdown.setAttribute('href', '#')
    enlaceDropdown.textContent = element
    itemDropdown.appendChild(enlaceDropdown)
    menuDropdown.appendChild(itemDropdown)
  })

  // Evento para manejar la selección de un elemento
  menuDropdown.addEventListener('click', (event) => {
    event.preventDefault()
    const seleccionado = event.target.textContent
    // Destruir el dropdown después de la selección
    contenedorDropdown.remove()
    // Llamar al callback con el elemento seleccionado
    callback(seleccionado)
  })

  // Se agrega el menu al contenedor
  contenedorDropdown.appendChild(menuDropdown)
  return contenedorDropdown
}

export { crearCustomDropdown }
