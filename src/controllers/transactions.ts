import { FastifyReply, FastifyRequest } from 'fastify'
import {
  createTransactionBodySchema,
  getTransactionByIdParamsSchema,
} from '../validations/transactons'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export const transactionControllers = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const { sessionId } = request.cookies
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      type,
      session_id: sessionId,
    })
    return reply.status(201).send()
  },
  list: async (request: FastifyRequest) => {
    const { sessionId } = request.cookies
    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select('*')
    console.log(transactions)

    return { transactions }
  },
  getById: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { sessionId } = request.cookies
      const { id } = getTransactionByIdParamsSchema.parse(request.params)
      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()
      if (!transaction) {
        return reply.status(404).send({
          message: `Route GET:/transactions/${id} not found`,
          error: 'Not Found',
          statusCode: 404,
        })
      }
      return { transaction }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return reply.status(400).send({ error: e.errors })
    }
  },
  summary: async (request: FastifyRequest) => {
    const { sessionId } = request.cookies
    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', {
        as: 'amount',
      })
      .first()
    console.log(summary)

    return { summary }
  },
}
