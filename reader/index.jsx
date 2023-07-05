import React, { useEffect, useState } from 'react'
import { PDFRenderingQueue } from 'pdfjs-dist/lib/web/pdf_rendering_queue'
import { EventBus, PDFLinkService } from 'pdfjs-dist/web/pdf_viewer'

import MainArea from './components/main-area'
import Layout from './components/layout'
import Header from './components/header'
import GlobalStore from './store'

const CoreReader = ({
  id,
  downloadUrl,
  repositories,
  year,
  abstract,
  title,
  oai,
}) => {
  // Create shared Queue for rendering pages and thumbnails
  const renderingQueue = new PDFRenderingQueue()

  // Bus used for catching all events from PDF.js
  const eventBus = new EventBus({ dispatchToDOM: false })

  // Link service allows to clicking on internal links in PDF
  const linkService = new PDFLinkService({ eventBus })

  const [members, setMembers] = useState([])

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch(
          'https://api-dev.core.ac.uk/internal/members'
        )
        const data = await response.json()

        const filtered = data.filter(
          (member) => !member.organisation_name.toLowerCase().includes('test')
        )
        setMembers(filtered)
      } catch (error) {
        console.error('Error retrieving data:', error)
        setMembers([])
      }
    }
    fetchMembers()
  }, [])

  return (
    <>
      <GlobalStore
        metadata={{
          id,
          url: downloadUrl,
          repositories,
          year,
          abstract,
          title,
          oai,
        }}
        document={{
          eventBus,
          linkService,
          renderingQueue,
        }}
      >
        <Layout id="pdf-viewer-container">
          <Header />
          <MainArea members={members} />
        </Layout>
      </GlobalStore>
    </>
  )
}

export default CoreReader
