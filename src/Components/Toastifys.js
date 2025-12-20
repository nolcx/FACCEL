import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

function WarningToasty (detalle) {
  Toastify({
    text: `⚠️ ${detalle} `,
    duration: 4000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: {
      color: '#333333ff',
      background: '#e9e3afff',
      borderRadius: '8px'
    }
  }).showToast()
}

function SuccessToasty (detalle) {
  Toastify({
    text: `✅ ${detalle} `,
    duration: 4000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: {
      color: '#333333ff',
      background: '#d1e7dd',
      borderRadius: '8px'
    }
  }).showToast()
}

function InfoToasty (detalle) {
  Toastify({
    text: `ℹ️ ${detalle} `,
    duration: 4000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: {
      color: '#333333ff',
      background: '#cfe2ff',
      borderRadius: '8px'
    }
  }).showToast()
}

function ErrorToasty (detalle) {
  Toastify({
    text: `❌ ${detalle}`,
    duration: 4000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: {
      color: '#333333ff',
      background: '#f8d7da',
      borderRadius: '8px'
    }
  }).showToast()
}

export { WarningToasty, SuccessToasty, InfoToasty, ErrorToasty }
