function crearCustomDropdown (elements, callback) {
  if (!Array.isArray(elements) || elements.length === 0) return null

  const container = document.createElement('div')
  container.className = 'custom-dropdown-container'

  const button = document.createElement('button')
  button.className = 'btn btn-secondary dropdown-toggle'
  button.type = 'button'
  button.setAttribute('data-bs-toggle', 'dropdown')
  button.setAttribute('aria-expanded', 'false')
  button.textContent = 'Seleccionar opción'

  const menu = document.createElement('ul')
  menu.className = 'dropdown-menu'

  elements.forEach(element => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.className = 'dropdown-item'
    a.href = '#'
    a.textContent = element
    li.appendChild(a)
    menu.appendChild(li)
  })

  menu.addEventListener('click', (event) => {
    event.preventDefault()
    const selected = event.target.textContent
    container.remove()
    callback(selected)
  })

  container.appendChild(button)
  container.appendChild(menu)
  return container
}

export { crearCustomDropdown }
