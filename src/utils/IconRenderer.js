import { Icons } from './Icons.js'

function renderIconsInElements () {
  const elementsWithIcons = document.querySelectorAll('[data-icon]')

  elementsWithIcons.forEach(element => {
    // Skip if icon already rendered (has child with btn-icon class)
    if (element.querySelector('.btn-icon')) {
      return
    }

    const iconKey = element.getAttribute('data-icon')
    const iconSvg = Icons[iconKey]

    if (iconSvg) {
      const iconSpan = document.createElement('span')
      iconSpan.className = 'btn-icon'
      iconSpan.innerHTML = iconSvg
      element.insertBefore(iconSpan, element.firstChild)
    }
  })
}

// Render icons on page load
document.addEventListener('DOMContentLoaded', renderIconsInElements)

// Also render when new elements with data-icon are added
const observer = new MutationObserver(() => {
  renderIconsInElements()
})

observer.observe(document.body, {
  childList: true,
  subtree: true
})

export { renderIconsInElements }
