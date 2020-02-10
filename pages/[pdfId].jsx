import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import ErrorPage from 'next/error'

import getArticleMetadata from '../reader/utils/getArticleMetadata'
import withGoogleAnalytics from '../utils/analytics'
import { getAssetPath } from '../utils/helpers'
import { Sentry } from '../utils/sentry'
import structuredMetadata from '../utils/structuredMetadata'

process.on('unhandledRejection', err => {
  Sentry.captureException(err)
})

process.on('uncaughtException', err => {
  Sentry.captureException(err)
})

const CoreReader = dynamic(() => import('../reader'), {
  ssr: false,
})

class Reader extends React.Component {
  static async getInitialProps({ query: { pdfId } }) {
    let statusCode = null
    let metadata = null
    let numberOfRetries = 2

    while (numberOfRetries) {
      try {
        // eslint-disable-next-line no-await-in-loop
        ;[metadata, statusCode] = await getArticleMetadata(pdfId)
        break
      } catch (e) {
        numberOfRetries -= 1
        if (![404, 410].includes(e.statusCode)) {
          if (!e.message.includes('socket hang up') || !numberOfRetries) {
            Sentry.withScope(scope => {
              // group API errors with the same status code together
              scope.setFingerprint(['api', e.statusCode])
              Sentry.captureException(e)
            })
            break
          }
        } else break
      }
    }

    return {
      ...(metadata || {}),
      structuredData: metadata ? structuredMetadata(metadata) : null,
      statusCode,
    }
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
        scope.setExtra('ssr', false)
      })

      Sentry.captureException(error)
    })
  }

  render() {
    const {
      statusCode,
      id,
      downloadLink,
      title,
      abstract,
      repositories,
      year,
      authors,
      oai,
      subjects,
      structuredData,
    } = this.props

    if (statusCode !== 200) return <ErrorPage statusCode={statusCode} />

    return (
      <>
        <Head>
          <title>{title} - CORE Reader</title>

          {['64', '128', '256', '512'].map(size => (
            <link
              key={size}
              rel="icon"
              type="image/png"
              sizes={`${size}x${size}`}
              href={getAssetPath(`/favicon/favicon-${size}px.png`)}
            />
          ))}

          <link
            rel="icon"
            sizes="any"
            type="image/svg+xml"
            href={getAssetPath('/favicon/favicon.svg')}
          />

          <meta name="referrer" content="origin" />
          {downloadLink && (
            <>
              <meta name="DC.format" content={downloadLink} />
              <meta name="citation_pdf_url" content={downloadLink} />
            </>
          )}

          {title && (
            <>
              <meta name="DC.title" content={title} />
              <meta name="citation_title" content={title} />
            </>
          )}

          {abstract && <meta name="DCTERMS.abstract" content={abstract} />}

          {(authors || []).length &&
            authors.map(author => (
              <meta key={author} name="citation_author" content={author} />
            )) &&
            authors.map(author => (
              <meta key={author} name="DC.creator" content={author} />
            ))}

          {year && (
            <>
              <meta name="citation_publication_date" content={year} />
              <meta name="DC.issued" content={year} />
            </>
          )}
          {oai && <meta name="DC.identifier" content={oai} />}
          {(subjects || []).length &&
            subjects.map(subject => (
              <meta key={subject} name="DC.subject" content={subject} />
            ))}

          {/* eslint-disable react/no-danger */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: structuredData,
            }}
          />
          {/* eslint-enable react/no-danger */}
          <style>
            {`
            html,
            body,
            #__next {
              margin: 0;
              height: 100%;
            }
          `}
          </style>
        </Head>
        <CoreReader
          id={id}
          downloadUrl={downloadLink}
          repositories={repositories}
          year={year}
          authors={authors}
        />
      </>
    )
  }
}

export default withGoogleAnalytics(Reader)
