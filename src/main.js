import { XMLParser } from "fast-xml-parser";
import { getTableofContents } from "./data_extraction_logic.js";

const parser = new XMLParser();
const XMLFile = document.getElementsByClassName('xml_input_form')[0];

XMLFile.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    const result = parser.parse(content);
    console.log('Parsed XML object:', result);
    const toc = getTableofContents(result);
    console.log('Table of Contents:', toc);
  }
  reader.readAsText(file);
});

