import Toastify from 'https://esm.sh/toastify-js@1.12.0'
import { Icons } from '../utils/Icons.js'

const createToastElement = (icon, message, type) => {
  const div = document.createElement('div')
  div.className = `toast-content toast-${type}`
  div.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
  `
  return div
}

const createToastWithCloseButton = (element) => {
  const wrapper = document.createElement('div')
  wrapper.className = 'toast-wrapper'
  wrapper.appendChild(element)
  return wrapper
}

function WarningToasty (detalle) {
  const element = createToastElement(Icons.alertTriangle, detalle, 'warning')
  Toastify({
    node: element,
    duration: 4000,
    close: true,
    gravity: 'top',
    position: 'right',
    className: 'toastify-warning'
  }).showToast()
}

function SuccessToasty (detalle) {
  const element = createToastElement(Icons.checkCircle, detalle, 'success')
  Toastify({
    node: element,
    duration: 4000,
    close: true,
    gravity: 'top',
    position: 'right',
    className: 'toastify-success'
  }).showToast()
}

function InfoToasty (detalle) {
  const element = createToastElement(Icons.infoCircle, detalle, 'info')
  Toastify({
    node: element,
    duration: 4000,
    close: true,
    gravity: 'top',
    position: 'right',
    className: 'toastify-info'
  }).showToast()
}

function ErrorToasty (detalle) {
  const element = createToastElement(Icons.alertCircle, detalle, 'error')
  Toastify({
    node: element,
    duration: 4000,
    close: true,
    gravity: 'top',
    position: 'right',
    className: 'toastify-error'
  }).showToast()
}

export { WarningToasty, SuccessToasty, InfoToasty, ErrorToasty }
