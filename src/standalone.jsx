import React from 'react'
import { render } from 'react-dom'
import CoreReader from 'CoreReader'

render(
  <CoreReader
    pdfId={159107963}
    pdfUrl="https://core.ac.uk/download/pdf/159107963.pdf"
  />,
  document.getElementById('CORE_READER')
)
