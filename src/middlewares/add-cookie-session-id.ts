import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'crypto'

export async function addCookieSessionId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  let sessionId = request.cookies.sessionId
  if (!sessionId) {
    sessionId = randomUUID()
    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })
    request.cookies.sessionId = sessionId
  }
}
