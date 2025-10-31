import { XMLParser } from "fast-xml-parser"
import { getTableofContents } from "./data_extraction_logic.js"

const main_container = document.getElementsByClassName('main-container')[0]

const parser = new XMLParser()
const XMLFile = document.getElementsByClassName('xml_input_form')[0]

XMLFile.addEventListener('change', (event) => {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = function (e) {
    const content = e.target.result
    const result = parser.parse(content)
    const toc = getTableofContents(result)
    main_container.appendChild(toc)
  }
  reader.readAsText(file)
})

