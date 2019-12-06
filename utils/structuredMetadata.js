const structuredMetadata = metadata => {
  const ld = {
    '@context': 'http://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': 'https://core.ac.uk',
              name: 'CORE',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': `https://core.ac.uk/search?q=repositories.id:(${metadata.repositories.id})`,
              name: metadata.repositories.name,
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@id': `https://core.ac.uk/reader/${metadata.id}`,
              name: metadata.title,
              image: `https://core.ac.uk/image/${metadata.id}/large`,
            },
          },
        ],
      },
      {
        '@type': 'ScholarlyArticle',
        '@id': `https://core.ac.uk/reader/${metadata.id}`,
        headline: metadata.title,
        description: metadata.abstract || undefined,
        sameAs: metadata.doi || undefined,
        name: metadata.title,
        author:
          metadata.authors &&
          metadata.authors.map(author => ({
            '@type': 'Person',
            name: author,
          })),
        datePublished: metadata.year || '',
        isAccessibleForFree: true,
        provider: {
          '@type': 'Organization',
          name: metadata.repositories.name,
        },
        image: `https://core.ac.uk/image/${metadata.id}/large`,
        publisher: metadata.publisher || '',
      },
    ],
  }

  return JSON.stringify(ld)
}

export default structuredMetadata
