/**
 * http://www.bibme.org/citation-guide/apa/journal-article/
 * Author, A. (Publication Year). Article title. Periodical Title,
 * Volume(Issue), pp-pp. doi:XX.XXXXX or Retrieved from URL
 */
const generateAPACitation = ({
  authors,
  journal,
  title,
  publisher,
  year,
  doi,
}) => {
  const citation = []

  // 1. Author’s last name, followed by a comma and the rest of the name

  if (authors.length === 1) citation.push(`${authors[0]}.`)
  else if (authors.length > 1) {
    // TODO: Others authors should be in order First Name and Last Name
    //       unfortunately API doesn't send first/last names just
    //       the whole names so it's not possible to distinguish it yet.
    citation.push(
      `${authors.slice(0, -1).join(', ')}, & ${authors[authors.length - 1]}.`
    )
  }

  // 2. Publication year in parentheses
  citation.push(`(${year}).`)

  // 3. The title of the source should follow the publication year.
  citation.push(`${title}.`)

  // TODO: 4. Title of container
  //       5. Other contributors
  //       6. Number - If a source is part of a numbered sequence
  //       7. Location, i.e. page numbers
  //       8. All others optional elements such as:
  //            - date of original publication
  //            - city of publication
  //            - date of access
  //            - URLs

  if (publisher) {
    if (journal) citation.push(`${journal},`)
    citation.push(`${publisher}.`)
  } else if (journal) citation.push(`${journal}.`)

  // 9. DOI (optional element)
  if (doi) citation.push(`doi:${doi}`)

  return citation.join(' ')
}

export default generateAPACitation
