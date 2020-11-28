import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { makeSchema } from '@nexus/schema'
import * as path from 'path'
import { config } from 'dotenv'
import CORS from 'cors'

import { schema } from './schema'
import { createContext } from './context'

config()

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000

const apollo = new ApolloServer({
  context: req => createContext({ req }),
  schema: makeSchema({
    types: [schema],
    typegenAutoConfig: {
      contextType: 'ctx.Context',
      sources: [
        { source: '.prisma/client', alias: 'PrismaClient' },
        { source: path.resolve('./src/context.ts'), alias: 'ctx' },
      ],
      // sources: [{ source: path.resolve('./src/context.ts'), alias: 'ctx' }],
      // contextType: 'ctx.Context',
    },
    outputs: {
      typegen: path.join(
        __dirname,
        '../node_modules/@types/nexus-typegen/index.d.ts',
      ),
      schema: path.join(__dirname, './api.graphql'),
    },
    prettierConfig: require.resolve('../../.prettierrc'),
  }),
})

const app = express()
app.use(CORS())
apollo.applyMiddleware({ app })

app.listen(PORT, () => {
  console.log(`🚀 GraphQL service ready at http://localhost:4000/graphql`)
})
