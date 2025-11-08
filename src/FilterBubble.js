function getFilterBubble (type, value, event) {
  const bubble = document.createElement('div')
  bubble.classList.add('filter-bubble')
  // Si el tipo es fecha, color amarillo claro
  switch (type) {
    case 'date':
      bubble.style.backgroundColor = '#fff3cd'
      break
    case 'receptor':
      bubble.style.backgroundColor = '#cfe2ff'
      break
    case 'provider':
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
    console.log('Eliminando burbuja de filtro:', value)
    bubble.remove()
  })

  return bubble
}

export { getFilterBubble }
