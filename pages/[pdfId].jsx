import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import ErrorPage from 'next/error'
import getArticleMetadata from '../reader/utils/getArticleMetadata'
import withGoogleAnalytics from '../utils/withGoogleAnalytics'

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
      downloadUrl,
      title,
      description,
      repositories,
      year,
      authors,
      oai,
      subjects,
    } = this.props

    if (statusCode !== 200) return <ErrorPage statusCode={statusCode} />

    return (
      <>
        <Head>
          <title>{title} - CORE Reader</title>

          <meta name="DC.format" content={downloadUrl} />
          <meta name="citation_pdf_url" content={downloadUrl} />

          <meta name="DC.title" content={title} />
          <meta name="citation_title" content={title} />
          <meta name="DCTERMS.abstract" content={description} />

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
        </Head>
        <CoreReader
          id={id}
          downloadUrl={downloadUrl}
          title={title}
          description={description}
          repositories={repositories}
          year={year}
          authors={authors}
          oai={oai}
          subjects={subjects}
        />
      </>
    )
  }
}

export default withGoogleAnalytics(Reader)
