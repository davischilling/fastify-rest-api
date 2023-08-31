import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'
import app from '../../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Transactions e2e Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:latest')
  })

  afterEach(async () => {
    execSync('npm run knex migrate:rollback --all')
  })

  describe('/POST - Create transaction', () => {
    it('should be able to create a new transaction', async () => {
      await request(app.server)
        .post('/transactions')
        .send({
          title: 'Salary',
          amount: 11000,
          type: 'credit',
        })
        .expect(201)
    })
  })

  describe('/GET - List transactions', () => {
    it('should return 401 and unauthortized error if empty sessionId', async () => {
      await request(app.server).get('/transactions').expect(401)
    })

    it('should be able to list all transactions', async () => {
      const newTransaction = {
        title: 'Salary',
        amount: 11000,
        type: 'credit',
      }
      const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send(newTransaction)

      const cookies = createTransactionResponse.headers['set-cookie']
      const listTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

      expect(listTransactionsResponse.body.transactions).toEqual([
        expect.objectContaining(newTransaction),
      ])
    })
  })

  describe('/GET - Get transaction by id', () => {
    it('should return 401 and unauthortized error if empty sessionId', async () => {
      await request(app.server).get('/transactions/123').expect(401)
    })

    it('should return 404 and not found error if transaction does not exists', async () => {
      const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
          title: 'Salary',
          amount: 11000,
          type: 'credit',
        })

      const cookies = createTransactionResponse.headers['set-cookie']
      await request(app.server)
        .get('/transactions/6ba7b810-9dad-11d1-80b4-00c04fd430c8')
        .set('Cookie', cookies)
        .expect(404)
    })

    it('should be able to get transaction by id', async () => {
      const newTransaction = {
        title: 'Salary',
        amount: 11000,
        type: 'credit',
      }
      const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send(newTransaction)

      const cookies = createTransactionResponse.headers['set-cookie']
      console.log(cookies)

      const getTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)

      const transactionId = getTransactionsResponse.body.transactions[0].id
      const getTransactionByIdResponse = await request(app.server)
        .get(`/transactions/${transactionId}`)
        .set('Cookie', cookies)

      expect(getTransactionByIdResponse.body.transaction).toEqual(
        expect.objectContaining(newTransaction),
      )
    })
  })

  describe('/GET - Get transaction summary', () => {
    it('should return 401 and unauthortized error if empty sessionId', async () => {
      await request(app.server).get('/transactions/summary').expect(401)
    })

    it('should be able to get transactions summary', async () => {
      const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
          title: 'Salary',
          amount: 11000,
          type: 'credit',
        })

      const cookies = createTransactionResponse.headers['set-cookie']
      await request(app.server)
        .post('/transactions')
        .set('Cookie', cookies)
        .send({
          title: 'restaurant',
          amount: 69,
          type: 'debit',
        })

      const getTransactionsSummaryResponse = await request(app.server)
        .get(`/transactions/summary`)
        .set('Cookie', cookies)

      expect(getTransactionsSummaryResponse.body).toEqual({
        summary: {
          amount: 10931,
        },
      })
    })
  })
})
