import { Icons } from '../utils/Icons.js'

function InfoToolTip (detalle) {
  const wrapper = document.createElement('span')
  wrapper.className = 'tooltip-wrapper'
  wrapper.style.position = 'relative'
  wrapper.style.display = 'inline-flex'
  wrapper.style.alignItems = 'center'

  const container = document.createElement('span')
  container.className = 'tooltip-icon-wrapper'
  container.setAttribute('aria-label', detalle)
  container.innerHTML = Icons.infoCircle
  container.style.cursor = 'help'
  container.style.display = 'inline-flex'
  container.style.alignItems = 'center'
  container.style.marginLeft = '6px'
  container.style.color = 'var(--primary-color)'
  container.style.transition = 'var(--transition)'
  container.style.width = '18px'
  container.style.height = '18px'
  container.style.flexShrink = '0'

  const tooltip = document.createElement('div')
  tooltip.className = 'custom-tooltip'
  tooltip.textContent = detalle
  tooltip.style.display = 'none'
  tooltip.style.position = 'absolute'
  tooltip.style.bottom = '120%'
  tooltip.style.left = '-50%'
  tooltip.style.transform = 'translateX(50%)'
  tooltip.style.backgroundColor = 'var(--secondary-color)'
  tooltip.style.color = 'white'
  tooltip.style.padding = '6px 10px'
  tooltip.style.borderRadius = '4px'
  tooltip.style.fontSize = '12px'
  tooltip.style.whiteSpace = 'nowrap'
  tooltip.style.zIndex = '1000'
  tooltip.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
  tooltip.style.pointerEvents = 'none'

  container.addEventListener('mouseenter', (e) => {
    e.currentTarget.style.color = 'var(--primary-dark)'
    e.currentTarget.style.transform = 'scale(1.15)'
    tooltip.style.display = 'block'
  })

  container.addEventListener('mouseleave', (e) => {
    e.currentTarget.style.color = 'var(--primary-color)'
    e.currentTarget.style.transform = 'scale(1)'
    tooltip.style.display = 'none'
  })

  wrapper.appendChild(container)
  wrapper.appendChild(tooltip)

  return wrapper
}

export { InfoToolTip }
