import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Item {
  id: ID!
  url: String
  link: String
}

type Query {
  allItems: [Item]
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
