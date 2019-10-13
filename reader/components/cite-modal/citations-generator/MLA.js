/**
 * https://owl.purdue.edu/owl/research_and_citation/mla_style/mla_formatting_and_style_guide/mla_formatting_and_style_guide.html
 */
const generateMLACitation = ({
  authors,
  journal,
  title,
  publisher,
  year,
  doi,
}) => {
  let citation = []

  // 1. Author’s last name, followed by a comma and the rest of the name

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

  if (journal) citation.push(`${journal},`)

  // TODO: 4. Other contributors
  //       5. Number - If a source is part of a numbered sequence

  // 6. Publisher - If there is more than one publisher
  // separate them by a forward slash (/).
  // TODO: AFAIK API sends only one publisher as a string
  if (publisher) citation.push(`${publisher},`)

  // 7. Publication date
  citation.push(`${year},`)
  //
  // TODO: 8. Location, i.e. page numbers

  // 8. DOI (optional element)
  if (doi) citation.push(`doi:${doi},`)

  // TODO: 9. All others optional elements such as:
  //            - date of original publication
  //            - city of publication
  //            - date of access
  //            - URLs

  citation = citation.join(' ')
  return `${citation.slice(0, -1)}.`
}

export default generateMLACitation
