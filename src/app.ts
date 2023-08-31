import fastify from 'fastify'
import { transactionRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()

app.get('/', async () => {
  return { hello: 'world' }
})

app.addHook('preHandler', async (request) => {
  console.log(`App Context: [${request.method}] ${request.url} [START]`)
})

app.register(cookie)
app.register(transactionRoutes, {
  prefix: 'transactions',
})

export default app
