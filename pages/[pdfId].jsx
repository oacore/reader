import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import ErrorPage from 'next/error'
import getArticleMetadata from '../reader/utils/getArticleMetadata'
import withGoogleAnalytics from '../utils/withGoogleAnalytics'
import { getAssetPath } from '../utils/helpers'

const CoreReader = dynamic(() => import('../reader'), {
  ssr: false,
})

class Reader extends React.Component {
  static async getInitialProps({ query: { pdfId } }) {
    try {
      return await getArticleMetadata(pdfId)
    } catch (e) {
      return { statusCode: e.statusCode }
    }
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
    } = this.props

    if (statusCode !== 200) return <ErrorPage statusCode={200} />

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
              href={getAssetPath(`/static/favicon/favicon-${size}px.png`)}
            />
          ))}

          <link
            rel="icon"
            sizes="any"
            type="image/svg+xml"
            href={getAssetPath('/static/favicon/favicon.svg')}
          />

          <meta name="referrer" content="origin" />
          <meta name="DC.format" content={downloadLink} />
          <meta name="citation_pdf_url" content={downloadLink} />

          <meta name="DC.title" content={title} />
          <meta name="citation_title" content={title} />
          <meta name="DCTERMS.abstract" content={abstract} />

          {authors.map(author => (
            <meta key={author} name="citation_author" content={author} />
          ))}
          {authors.map(author => (
            <meta key={author} name="DC.creator" content={author} />
          ))}

          <meta name="citation_publication_date" content={year} />
          <meta name="DC.issued" content={year} />

          <meta name="DC.identifier" content={oai} />
          {subjects.map(subject => (
            <meta key={subject} name="DC.subject" content={subject} />
          ))}

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
