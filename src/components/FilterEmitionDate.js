import { ButtonFactory, InputFactory, ContainerFactory } from '../utils/ComponentFactory.js'

function crearFilterEmitionDate (callback) {
  const container = ContainerFactory.createFlex('column', 'md', 'filter-emition-date')
  container.style.maxWidth = '300px'
  container.style.padding = 'var(--spacing-lg)'
  container.style.backgroundColor = 'var(--secondary-light)'
  container.style.borderRadius = 'var(--radius-md)'
  container.style.border = '1px solid var(--border-color)'

  const label = document.createElement('label')
  label.textContent = 'Seleccionar Fecha de Emisión'
  label.style.marginBottom = 'var(--spacing-md)'

  const dateInput = InputFactory.createDateInput('emition-date-input')

  const buttonContainer = document.createElement('div')
  buttonContainer.className = 'd-flex gap-2'

  const btnApply = ButtonFactory.create(
    'Aplicar',
    'primary',
    'md',
    () => {
      const fecha = dateInput.value
      container.remove()
      callback(fecha)
    },
    'checkCircle'
  )

  const btnDiscard = ButtonFactory.create(
    'Cancelar',
    'secondary',
    'md',
    () => {
      container.remove()
      callback()
    },
    'x'
  )

  buttonContainer.appendChild(btnApply)
  buttonContainer.appendChild(btnDiscard)

  container.appendChild(label)
  container.appendChild(dateInput)
  container.appendChild(buttonContainer)

  return container
}

export { crearFilterEmitionDate }
