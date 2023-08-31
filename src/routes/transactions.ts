import { FastifyInstance } from 'fastify'
import { transactionControllers } from '../controllers/transactions'
import { authSessionId } from '../middlewares/auth-session-id'
import { addCookieSessionId } from '../middlewares/add-cookie-session-id'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(
      `Transaction Context: [${request.method}] ${request.url} [START]`,
    )
  })

  app.post(
    '/',
    {
      preHandler: [addCookieSessionId],
    },
    transactionControllers.create,
  )
  app.get(
    '/',
    {
      preHandler: [authSessionId],
    },
    transactionControllers.list,
  )
  app.get(
    '/:id',
    {
      preHandler: [authSessionId],
    },
    transactionControllers.getById,
  )
  app.get(
    '/summary',
    {
      preHandler: [authSessionId],
    },
    transactionControllers.summary,
  )
}
