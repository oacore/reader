import React from 'react'
import { render } from 'react-dom'
import CoreReader from 'CoreReader'

render(
  <CoreReader
    pdfId={159107963}
    pdfUrl="https://core.ac.uk/download/pdf/159107963.pdf"
    pdfTitle="Mining Scholarly Publications for Research Evaluation"
    pdfAbstract="Abstract"
    publisher="Open University"
    year="2018"
    additionalInfo="Proceedings of the 16th ACM/IEEE-CS Joint Conference on Digital Libraries"
    authors={['Author 1', 'Author 2']}
    identifier="oai:oro.open.ac.uk:55421"
    subject="Subject"
  />,
  document.getElementById('CORE_READER')
)
