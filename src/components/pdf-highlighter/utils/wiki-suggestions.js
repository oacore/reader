import URI from 'urijs'
import { memoize } from 'lodash'

// Bear in mind that memoize uses only first arg as cache key
const getWikipediaSuggestions = memoize(async searchTerm => {
  const srsearch = searchTerm.replace(/\s/g, ' ')

  try {
    let wikipediaSuggestions = await fetch(
      new URI('https://en.wikipedia.org/w/api.php').query({
        origin: '*',
        action: 'query',
        list: 'search',
        format: 'json',
        srsearch,
      })
    )

    wikipediaSuggestions = await wikipediaSuggestions.json()

    return wikipediaSuggestions.query.search.map(w => {
      return [`https://en.wikipedia.org/?curid=${w.pageid}`, w.title, w.snippet]
    })
  } catch (e) {
    return []
  }
})

export default getWikipediaSuggestions
