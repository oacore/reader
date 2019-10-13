/**
 * http://www.citethisforme.com/guides/iso690-author-date-en/how-to-cite-a-journal
 * Author Surname, Author Forename, Year Published, Title.
 * Publication Title [online]. Year Published. Vol. Volume number,
 * no. Issue number, p. Pages Used. [Accessed 10  October  2013].
 * DOI DOI Number. Available from: http://Website URLAvailable Via
 */
const generateISO690Citation = ({
  authors,
  journal,
  title,
  publisher,
  year,
  doi,
}) => {
  let citation = []

  // 1. Author’s last name (capitalized), followed by a comma
  // and the rest of the name
  if (authors.length === 1) citation.push(`${authors[0]}.`)
  else if (authors.length > 1) {
    // TODO: Others authors should be in order First Name and Last Name
    //       unfortunately API doesn't send first/last names just
    //       the whole names so it's not possible to distinguish it yet.
    citation.push(
      `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}.`
    )
  }

  // 2. The title of the source should follow the author’s name.
  // Depending upon the type of source, it should be listed in italics or
  // quotation marks.
  // TODO: API doesn't send type AFAIK.
  //      Title will be wrapped in quotation marks always.
  citation.push(`“${title}${!title.endsWith('.') && '.'}”`)

  // 3. Journal name
  if (journal) citation.push(`${journal}.`)

  // 4. Publisher
  // TODO: AFAIK API sends only one publisher as a string
  if (publisher) citation.push(`${publisher},`)

  // 5. Publication date
  citation.push(`${year}.`)

  // TODO: 6. Other contributors
  //       7. Number - If a source is part of a numbered sequence
  //       8. Location, i.e. page numbers

  // 9. DOI (optional element)
  if (doi) citation.push(`DOI ${doi},`)

  // TODO: 10. All others optional elements such as:
  //            - date of original publication
  //            - city of publication
  //            - date of access
  //            - URLs

  citation = citation.join(' ')
  return `${citation.slice(0, -1)}.`
}

export default generateISO690Citation
