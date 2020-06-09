import React, { useEffect, useState, cloneElement } from 'react'

import pdfjs from '../../lib/pdf-js/webpack'
import { Sentry } from '../../../utils/sentry'
import styles from './styles.module.css'
import { logTiming } from '../../../utils/analytics'
import DocumentPlaceholder from './document-placeholder'
import LoadingBar from '../loading-bar'

const CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.4.456/cmaps/'
const CMAP_PACKED = true

const redirect = url => {
  if (url) setTimeout(() => window.location.replace(url), 5000)
}
const PdfLoader = React.memo(({ url, children }) => {
  const [documentProxy, setDocumentProxy] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load document on mount
  useEffect(() => {
    const loadPDFDocument = async () => {
      try {
        // it's forbidden to load http content over https
        // browser will block it
        if (url.startsWith('http://')) {
          setIsLoading(false)
          redirect(url)
        } else {
          const startTime = Date.now()
          const document = await pdfjs.getDocument({
            url,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
          }).promise

          document.getDownloadInfo().then(() => {
            logTiming({
              category: 'API calls',
              variable: '/pdf/download/<id>',
              value: Date.now() - startTime,
            })
          })
          setDocumentProxy(document)
        }
      } catch (e) {
        console.error(
          `Unable to load PDF document. Redirecting to default browser view. Error: ${e}`
        )
        Sentry.withScope(scope => {
          // group redirection errors together
          scope.setFingerprint(['redirection'])
          Sentry.captureException(e)
        })
        redirect(url)
      } finally {
        setIsLoading(false)
      }
    }
    loadPDFDocument()
  }, [])

  if (documentProxy) return cloneElement(children, { documentProxy })

  return (
    <>
      {isLoading && <LoadingBar />}
      <DocumentPlaceholder>
        {!isLoading && (
          <div className={styles.notice}>
            We are not allowed to display external PDFs yet. You will be
            redirected to the full text document in the repository in a few
            seconds, if not <a href={url}>click here</a>.
          </div>
        )}
      </DocumentPlaceholder>
    </>
  )
})

export default PdfLoader
