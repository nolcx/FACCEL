class ButtonFactory {
  static create (label, variant = 'primary', size = 'md', onClick = null, icon = null) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `btn btn-${variant} btn-${size}`
    button.textContent = label

    if (icon) {
      button.setAttribute('data-icon', icon)
    }

    if (onClick) button.addEventListener('click', onClick)
    return button
  }
}

class InputFactory {
  static createFileInput (id, label, onChange) {
    const wrapper = document.createElement('div')

    const labelEl = document.createElement('label')
    labelEl.htmlFor = id
    labelEl.textContent = label
    wrapper.appendChild(labelEl)

    const input = document.createElement('input')
    input.type = 'file'
    input.id = id
    input.className = 'form-control'
    if (onChange) input.addEventListener('change', onChange)
    wrapper.appendChild(input)

    return wrapper
  }

  static createTextInput (id, placeholder, onChange = null) {
    const input = document.createElement('input')
    input.type = 'text'
    input.id = id
    input.className = 'form-control'
    input.placeholder = placeholder
    if (onChange) input.addEventListener('change', onChange)
    return input
  }

  static createDateInput (id, onChange = null) {
    const input = document.createElement('input')
    input.type = 'date'
    input.id = id
    input.className = 'form-control'
    if (onChange) input.addEventListener('change', onChange)
    return input
  }
}

class CheckboxFactory {
  static create (id, label, onChange = null, checked = false) {
    const wrapper = document.createElement('div')
    wrapper.className = 'd-flex align-items-center gap-2'

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = id
    checkbox.className = 'btn-check'
    checkbox.checked = checked
    if (onChange) checkbox.addEventListener('change', onChange)

    const labelEl = document.createElement('label')
    labelEl.htmlFor = id
    labelEl.className = 'btn btn-secondary'
    labelEl.textContent = label

    wrapper.appendChild(checkbox)
    wrapper.appendChild(labelEl)

    return { wrapper, checkbox, label: labelEl }
  }
}

class TableFactory {
  static create (headers, rows = [], className = 'table-contents') {
    const table = document.createElement('table')
    table.className = className

    const thead = table.createTHead()
    const headerRow = document.createElement('tr')

    headers.forEach(header => {
      const th = document.createElement('th')
      th.textContent = header
      headerRow.appendChild(th)
    })

    thead.appendChild(headerRow)

    if (rows.length > 0) {
      const tbody = table.createTBody()
      rows.forEach(row => {
        const tr = document.createElement('tr')
        row.forEach(cell => {
          const td = document.createElement('td')
          td.textContent = cell
          tr.appendChild(td)
        })
        tbody.appendChild(tr)
      })
    }

    return table
  }

  static addRow (table, rowData) {
    let tbody = table.querySelector('tbody')
    if (!tbody) {
      tbody = table.createTBody()
    }

    const tr = document.createElement('tr')
    rowData.forEach(cell => {
      const td = document.createElement('td')
      td.textContent = cell
      tr.appendChild(td)
    })

    tbody.appendChild(tr)
    return tr
  }
}

class CardFactory {
  static create (title, content = null, className = '') {
    const card = document.createElement('div')
    card.className = `factura-container ${className}`

    if (title) {
      const titleEl = document.createElement('div')
      titleEl.className = 'factura-header'
      const h5 = document.createElement('h5')
      h5.className = 'factura-filename'
      h5.textContent = title
      titleEl.appendChild(h5)
      card.appendChild(titleEl)
    }

    if (content) {
      if (typeof content === 'string') {
        card.innerHTML += content
      } else {
        card.appendChild(content)
      }
    }

    return card
  }
}

class BadgeFactory {
  static create (text, type = 'primary') {
    const badge = document.createElement('span')
    badge.className = `filter-bubble filter-bubble-${type}`
    badge.textContent = text
    return badge
  }

  static createWithClose (text, onClose, type = 'primary') {
    const wrapper = document.createElement('div')
    wrapper.className = 'filter-bubble'
    wrapper.style.backgroundColor = 'var(--primary-light)'
    wrapper.style.borderColor = 'var(--primary-color)'
    wrapper.style.color = 'var(--primary-dark)'

    const textEl = document.createElement('span')
    textEl.textContent = text
    wrapper.appendChild(textEl)

    const closeBtn = document.createElement('span')
    closeBtn.className = 'filter-bubble-close'
    closeBtn.innerHTML = '✕'
    closeBtn.style.cursor = 'pointer'
    closeBtn.addEventListener('click', onClose)
    wrapper.appendChild(closeBtn)

    return wrapper
  }
}

class TooltipFactory {
  static create (text, content) {
    const wrapper = document.createElement('span')
    wrapper.style.display = 'inline-flex'
    wrapper.style.alignItems = 'center'
    wrapper.style.gap = 'var(--spacing-sm)'

    const icon = document.createElement('span')
    icon.className = 'tooltip-icon'
    icon.title = content
    icon.textContent = 'i'
    icon.setAttribute('aria-label', content)

    wrapper.appendChild(icon)
    return wrapper
  }
}

class ContainerFactory {
  static createFlex (direction = 'row', gap = 'md', className = '') {
    const container = document.createElement('div')
    const dirClass = direction === 'column' ? 'flex-column' : 'd-flex'
    container.className = `d-flex ${dirClass} gap-${gap === 'md' ? '2' : gap} ${className}`
    return container
  }

  static createSection (title, className = '') {
    const section = document.createElement('div')
    section.className = className

    if (title) {
      const heading = document.createElement('h2')
      heading.className = 'header-filter-list'
      heading.textContent = title
      section.appendChild(heading)
    }

    return section
  }
}

export {
  ButtonFactory,
  InputFactory,
  CheckboxFactory,
  TableFactory,
  CardFactory,
  BadgeFactory,
  TooltipFactory,
  ContainerFactory
}
