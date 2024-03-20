process.env.NODE_ENV = 'test'
const request = require('supertest')
const app = require('../app')
const db = require('../db')

let testUser; 
beforeEach(async () =>{
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('tc','Test Company', 'this is a test company') RETURNING code, name, description`)
    testUser = result.rows[0]
})

afterEach(async () =>{
    await db.query(`DELETE FROM companies`)
})

afterAll(async () =>{
    await db.end()
})

describe('POST /companies', function(){
    test('Create Company', async () =>{
        const res = await request(app)
            .post('/companies')
            .send({code: 'ot', name: 'other test', description: 'desct'})
        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual({company: {id: expect.any(Number), code: 'ot', name: 'other test', description: 'desct'}})
    })
})