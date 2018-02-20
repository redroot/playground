const items = [
  {
    id: 1,
    url: 'http://bbc.com',
    link: 'The BBC'
  },
  {
    id: 2,
    url: 'https://noway.com',
    link: 'No Way'
  }
]

export const resolvers = {
  Query: {
    allItems: () => items
  }
};
