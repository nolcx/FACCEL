import { ButtonFactory, InputFactory, ContainerFactory } from '../utils/ComponentFactory.js'

function crearFilterBetweenDates (callback) {
  const container = ContainerFactory.createFlex('column', 'md', 'filter-between-dates')
  container.style.maxWidth = '300px'
  container.style.padding = 'var(--spacing-lg)'
  container.style.backgroundColor = 'var(--secondary-light)'
  container.style.borderRadius = 'var(--radius-md)'
  container.style.border = '1px solid var(--border-color)'

  const labelStart = document.createElement('label')
  labelStart.textContent = 'Fecha de Inicio'
  labelStart.style.marginBottom = 'var(--spacing-sm)'

  const dateInputStart = InputFactory.createDateInput('date-start-input')

  const labelEnd = document.createElement('label')
  labelEnd.textContent = 'Fecha de Fin'
  labelEnd.style.marginBottom = 'var(--spacing-sm)'
  labelEnd.style.marginTop = 'var(--spacing-md)'

  const dateInputEnd = InputFactory.createDateInput('date-end-input')

  const buttonContainer = document.createElement('div')
  buttonContainer.className = 'd-flex gap-2'
  buttonContainer.style.marginTop = 'var(--spacing-lg)'

  const btnApply = ButtonFactory.create(
    'Aplicar',
    'primary',
    'md',
    () => {
      const inicio = dateInputStart.value
      const fin = dateInputEnd.value
      container.remove()
      callback(inicio, fin)
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

  container.appendChild(labelStart)
  container.appendChild(dateInputStart)
  container.appendChild(labelEnd)
  container.appendChild(dateInputEnd)
  container.appendChild(buttonContainer)

  return container
}

export { crearFilterBetweenDates }
