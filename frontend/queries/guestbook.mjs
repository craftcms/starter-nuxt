export const GUESTBOOK_QUERY = `
  query Guestbook($limit: Int!, $offset: Int!) {
    guestbookEntries(limit: 1) {
      ... on page_Entry {
        id
        pageContent
        pageSubheading
        slug
        title
      }
    }
    postsEntries(limit: $limit, offset: $offset) {
      ... on text_Entry {
        id
        title
        textBlock @markdown
        postDate @formatDateTime(format: "F j, Y")
      }
    }
    entryCount(section: "posts")
  }
`