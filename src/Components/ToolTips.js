/* eslint-disable no-unused-vars, no-undef, no-new */
function InfoToolTip (detalle) {
  const infoIcon = document.createElement('i')
  infoIcon.classList.add('bi', 'bi-info-circle', 'ms-1')
  infoIcon.setAttribute('data-bs-toggle', 'tooltip')
  infoIcon.setAttribute('data-bs-placement', 'top')
  infoIcon.setAttribute('data-bs-title', detalle)
  infoIcon.style.cursor = 'pointer'
  infoIcon.style.color = '#0d6efd'

  // Inicializar el tooltip de Bootstrap
  new bootstrap.Tooltip(infoIcon)

  return infoIcon
}
export { InfoToolTip }
