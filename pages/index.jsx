import React from 'react'
import dynamic from 'next/dynamic'
import ErrorPage from 'next/error'
import getArticleMetadata from '../reader/utils/getArticleMetadata'

const CoreReader = dynamic(() => import('../reader'), {
  ssr: false,
})

class Reader extends React.Component {
  static async getInitialProps({ query: { id } }) {
    try {
      const { data } = await getArticleMetadata(id)
      return {
        statusCode: 200,
        ...data,
      }
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
    )
  }
}

export default Reader
