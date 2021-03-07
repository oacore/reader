import { useEffect } from 'react'
import tippy from 'tippy.js'

import styles from './styles.module.css'

function getAnnotations(text) {
  return fetch('http://localhost:8000/api/v1/wikify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  }).then((response) => response.json())
}

const Wikify = ({ eventBus, children }) => {
  useEffect(() => {
    eventBus.on('textlayerrendered', async (d) => {
      const annotations = await getAnnotations(
        d.source.textContentItemsStr.join()
      )

      return
      const ranges = annotations.map((spanAnnotation, spanindex) => {
        const span = d.source.textDivs[spanindex]
        // console.log(d)
        return spanAnnotation.map((a) => {
          const range = document.createRange()
          range.setStart(span.firstChild, a.position[0])
          range.setEnd(span.firstChild, a.position[1])
          return [range, a.data]
        })
      })

      ranges.flat().forEach(([range, data]) => {
        const mark = document.createElement('mark')

        mark.classList.add(styles.wikiAnnotation)
        range.surroundContents(mark)
        const img = data.thumbnail?.source
          ? `<div style="width: ${data.thumbnail.width}px; height: ${data.thumbnail.height}px; align-self: center; margin: -10px -10px 10px -10px;"><img src="${data.thumbnail.source}"/></div>`
          : ''

        tippy(mark, {
          content: `<a href="?https://en.wikipedia.org/?curid=${data.id}" style="display: block; margin: 10px; display: flex; flex-direction: column; color: inherit;">
                        ${img}
                        <div style="border-top: 1px solid var(--gray-600); max-height: 100px; overflow: hidden;" >${data.description}</div>
                     </a>`,
          allowHTML: true,
          theme: 'light-border',
          interactive: true,
          animation: 'shift-away',
          arrow: false,
          interactiveBorder: 5,
          // trigger: 'manual',
          appendTo: () => document.body,
          // placement: 'top-start',
        })
      })
    })
  }, [])
  return children
}

export default Wikify
