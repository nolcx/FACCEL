import { TIPOS_FILTER_BUBBLES } from '../config/constants'

function getFilterBubble (type, value, descartarFiltro, idFiltro) {
  const bubble = document.createElement('div')
  bubble.classList.add('filter-bubble', `filter-bubble-${idFiltro}`)
  // Si el tipo es fecha, color amarillo claro
  switch (type) {
    case TIPOS_FILTER_BUBBLES.FECHA:
      bubble.style.backgroundColor = '#fff3cd'
      break
    case TIPOS_FILTER_BUBBLES.ENTRE_FECHAS:
      bubble.style.backgroundColor = '#e3d2fdff'
      break
    case TIPOS_FILTER_BUBBLES.PROVEEDOR:
      bubble.style.backgroundColor = '#cfe2ff'
      break
    case TIPOS_FILTER_BUBBLES.RECEPTOR:
      bubble.style.backgroundColor = '#d1e7dd'
      break
    default:
      bubble.style.backgroundColor = '#e2e3e5'
  }
  bubble.textContent = `${value}`

  // Icon bootstrap
  const removeIcon = document.createElement('i')
  removeIcon.classList.add('bi', 'bi-x-lg', 'ms-2')
  bubble.appendChild(removeIcon)
  removeIcon.addEventListener('click', () => {
    bubble.remove()

    // Evento para descartar el filtro asociado
    descartarFiltro(idFiltro)
  })

  return bubble
}

export { getFilterBubble }
