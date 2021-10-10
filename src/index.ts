import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { addResolversToSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server'
import { join } from 'path'

import resolvers from './resolvers'
// import {getSession} from "next-auth/client";

const schema = loadSchemaSync(join(__dirname, '../schema.graphql'), {
  loaders: [new GraphQLFileLoader()]
})

const schemaWithResolvers = addResolversToSchema({ schema, resolvers })
const server = new ApolloServer({
  schema: schemaWithResolvers
  // context: async ({req}) => {
  //     const session = await getSession({req});
  //     return {session};
  // }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
