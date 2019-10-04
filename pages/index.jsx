import React from 'react'
import dynamic from 'next/dynamic'

const CoreReader = dynamic(() => import('../reader'), {
  ssr: false,
})

const Reader = () => (
  <CoreReader
    pdfId={159107963}
    pdfUrl="https://core.ac.uk/download/pdf/159107963.pdf"
    pdfTitle="Mining Scholarly Publications for Research Evaluation"
    pdfAbstract="Abstract"
    pubisher="Open University"
    year="2018"
    additionalInfo="Proceedings of the 16th ACM/IEEE-CS Joint Conference on Digital Libraries"
    authors={['Author 1', 'Author 2']}
    identifier="oai:oro.open.ac.uk:55421"
    subject="Subject"
  />
)

export default Reader
