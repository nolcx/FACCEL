function getFilterBubble (type, value, descartarFiltro, idFiltro) {
  const bubble = document.createElement('div')
  bubble.className = 'filter-bubble'
  bubble.id = `filter-bubble-${idFiltro}`

  const textEl = document.createElement('span')
  textEl.textContent = value
  bubble.appendChild(textEl)

  const closeBtn = document.createElement('span')
  closeBtn.className = 'filter-bubble-close'
  closeBtn.innerHTML = '✕'
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    bubble.remove()
    descartarFiltro(idFiltro)
  })
  bubble.appendChild(closeBtn)

  return bubble
}

export { getFilterBubble }
