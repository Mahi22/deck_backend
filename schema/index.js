import fs from 'fs';

function requireGraphQL(name) {
  const filename = require.resolve(name);
  return fs.readFileSync(filename, 'utf8');
}

const typeDefs = [`
  scalar ObjID
  type Query {
    # A placeholder, please ignore
    __placeholder: Int
  }
  type Mutation {
    # A placeholder, please ignore
    __placeholder: Int
  }
  type Subscription {
    # A placeholder, please ignore
    __placeholder: Int
  }
`];

export default typeDefs;

typeDefs.push(requireGraphQL('./Channel.graphql'));

typeDefs.push(requireGraphQL('./Amazon.graphql'));

typeDefs.push(requireGraphQL('./Flipkart.graphql'));

typeDefs.push(requireGraphQL('./Customer.graphql'));

typeDefs.push(requireGraphQL('./User.graphql'));
