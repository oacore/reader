import { saveAs } from 'file-saver'
import { Button, Icon } from '@oacore/design'
import React from 'react'

const downloadPdf = async (document, pdfUrl) => {
  const pdfName = pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1)

  try {
    // Try to download file via blob to avoid opening PDF in another PDF plugin
    const pdfData = await document.getData()
    const blob = new Blob([pdfData], { type: 'application/pdf' })
    saveAs(blob, pdfName)
  } catch (error) {
    // If blob is not supported or something happens
    // download it via traditional way
    // Code taken from https://github.com/mozilla/pdf.js/blob/master/web/download_manager.js#L28
    const a = document.createElement('a')
    a.href = pdfUrl
    a.target = '_blank'

    // Use a.download if available. This increases the likelihood that
    // the file is downloaded instead of opened by another PDF plugin.
    if ('download' in a) a.download = pdfName

    // <a> must be in the document for IE and recent Firefox versions,
    // otherwise .click() is ignored.
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
}

export const DownloadFile = ({ document, url, className }) => (
  <Button
    disabled={!document.documentProxy} // pdf is not loaded yet
    title="Download document"
    onClick={() => downloadPdf(document.documentProxy, url)}
    className={className}
  >
    <Icon src="#file-download" alt="Download document" />
  </Button>
)

export default DownloadFile
