/**
 * http://www.citethisforme.com/guides/iso690-author-date-en/how-to-cite-a-journal
 * @article{<reference_here>,
 *   title={<title_here>},
 *   author={<authors_names_here>>},
 *   journal={<journal_here>},
 *   volume={<volume_here>},
 *   number={<number_here>},
 *   pages={<page_range_here>},
 *   year={<year_here>},
 *   publisher={<publisher_here>}
 * }
 */
const generateBibTeX = ({
  id,
  authors,
  journal,
  title,
  publisher,
  year,
  doi,
}) => {
  let citation = ''
  let reference = ''
  if (authors.length) {
    reference = authors[0].split(',', 1)[0].toLowerCase()
    if (year) reference += `:${year}`
  } else reference = String(id)

  citation += `@article{${reference},\n`

  // 1. Title
  citation += `\ttitle={${title}},\n`

  // 2. Author
  citation += `\tauthor={${authors.join(', and ')}},\n`

  // 3. Journal
  if (journal) citation += `\tjournal={${journal}},\n`

  // 4. Publisher
  if (publisher) citation += `\tpublisher={${publisher}},\n`

  // 5. Year
  if (year) citation += `\tyear={${year}},\n`

  // 6. DOI (optional element)
  if (doi) citation += `\tdoi={${doi}},\n`

  return `${citation.slice(0, -2)}\n}`
}

export default generateBibTeX
