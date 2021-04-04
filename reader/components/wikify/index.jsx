import { useEffect } from 'react'
import tippy from 'tippy.js'

import styles from './styles.module.css'

function getAnnotations(text) {
  return fetch('http://localhost:9999/api/v1/wikify', {
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
        d.source.textContentItemsStr.join('')
      )

      const ranges = []

      // eslint-disable-next-line no-restricted-syntax
      for (const annotation of annotations) {
        let oldlen = 0
        let newlen = 0
        for (let i = 0; i < d.source.textContentItemsStr.length; i++) {
          oldlen = newlen
          newlen += d.source.textContentItemsStr[i].length

          // found the start of the entity
          if (
            annotation.position[0] < newlen
            // d.source.textDivs[i].firstChild !== null
          ) {
            // entity is within current span
            const range = document.createRange()
            const startIndex = Math.max(oldlen, annotation.position[0])
            const start = startIndex - oldlen
            const end = Math.min(
              annotation.position[1] - startIndex + start,
              d.source.textContentItemsStr[i].length
            )

            range.setStart(d.source.textDivs[i].firstChild, start)
            range.setEnd(d.source.textDivs[i].firstChild, end)
            ranges.push([range, annotation.data])

            if (annotation.position[1] - newlen <= 0) break

            // // entity multiple spans
            // if (
            //   annotation.position[0] <= newlen &&
            //   annotation.position[1] > newlen &&
            //   !foundStart
            // ) {
            //   const range = document.createRange()
            //   range.setStart(d.source.textDivs[i].firstChild, 0)
            //   range.setEnd(d.source.textDivs[i].firstChild, newlen -  annotation.position[0] )
            //   ranges.push([range, annotation.data])
            //   foundStart = true
            // }
            //
            // // entity withing multiple spans
            // if (
            //   annotation.position[1] > newlen &&
            //   !foundStart &&
            //   d.source.textDivs[i].firstChild
            // ) {
            //   const range = document.createRange()
            //   range.setStart(d.source.textDivs[i].firstChild, 0)
            //   range.setEnd(
            //     d.source.textDivs[i].firstChild,
            //     d.source.textContentItemsStr[i].length
            //   )
            //   ranges.push([range, annotation.data])
            // }

            //   else {
            //     try {
            //       const range = document.createRange()
            //       range.setStart(
            //         d.source.textDivs[i].firstChild,
            //         len - annotation.position[0]
            //       )
            //       range.setEnd(
            //         d.source.textDivs[i].firstChild,
            //         d.source.textContentItemsStr[i].length
            //       )
            //       ranges.push([range, annotation.data])
            //     } catch (e) {
            //       console.log(
            //         annotation,
            //         len,
            //         d.source.textContentItemsStr[i].length,
            //         len -
            //           d.source.textContentItemsStr[i].length -
            //           annotation.position[0]
            //       )
            //     }
            //   }
            // }

            // if(len <=)
          }

          // console.log(value)
        }
      }

      ranges.forEach(([range, data]) => {
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
