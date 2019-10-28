const request = require('supertest')
const app = require('./app.js')
const model = require('./model')

describe('app.js', () => {
    // http calls made w/ supertest return promises; we can use async/await if desired
    describe('Index route', () => {
        it('should return an OK status code from index route', async () => {
            const expectedStatusCode = 200
            const response = await request(app).get('/')

            expect(response.status).toEqual(expectedStatusCode)
        })

        it('should return a success message from the index route', async () => {
            const expectedBody = { message: `[Route] --> / <-- Welcome to the Lil Bit API!` }
            const response = await request(app).get('/')

            expect(response.body.message).toEqual(expectedBody.message)
        })

        it('should return a JSON object from index route', async () => {
            const response = await request(app).get('/')

            expect(response.type).toEqual('application/json')
        })
    })

    describe('API route', () => {
        it('should return an OK status from /api route', async () => {
            const expectedStatusCode = 200
            const response = await request(app).get('/api')

            expect(response.status).toEqual(expectedStatusCode)
        })

        it('should return a success message from the /api route', async () => {
            const expectedBody = { message: `[Route] --> / <-- Welcome to the Lil Bit API!` }
            const response = await request(app).get('/api')

            expect(response.body.message).toEqual(expectedBody.message) 
        })

        it('should return a JSON object from the /api route', async () => {
            const response = await request(app).get('/api')

            expect(response.type).toEqual('application/json')
        })
    })

    describe('Resources routes', () => {
        /*
            NOTE: I'm opting out of testing delete routes since that's not apart of user options it was mainly to get rid of bad data
        */
        it('should return an OK status from the /resources route', async () => {
            const expectedStatusCode = 200
            const response = await request(app).get('/api/resources')

            expect(response.status).toEqual(expectedStatusCode)
        })

        it('should return a success message from the /resources route', async () => {
            const expectedBody = { message: `URLs successfully retrieved!` }
            const response = await request(app).get('/api/resources')

            expect(response.body.message).toEqual(expectedBody.message)
        })

        it('should return a JSON object from the /resources route', async () => {
            const response = await request(app).get('/api/resources')

            expect(response.type).toEqual('application/json')
        })

        it('should return a specific URL based on provided ID', async () => {
            const expectedBody = { message: `URL successfully retrieved!` }
            const response = await request(app).get('/api/resources/1')
             
            expect(response.body.message).toEqual(expectedBody.message)
        })

        it('should fail properly when given an invalid ID for /:id route', async () => {
            const expectedStatusCode = 500
            const response = await request(app).get('/api/resources/100')

            expect(response.status).toEqual(expectedStatusCode)
        })
        
        it('should allow user to create a Lil Bit link w/o custom URL', async () => {
            const mockData = { original_url: 'http://ballin.com', redirect_url: '' }
            const [ response ] = await model.add('Resources', mockData)

            expect(response).toBeGreaterThan(0)
        })
        
        it('should allow user to create a Lil Bit link w/ a custom URL', async () => {
            const mockData = { original_url: 'http://ballin.com', redirect_url: '' }
            const [ response ] = await model.add('Resources', mockData)

            expect(response).toBeGreaterThan(0)
        })
        
    })

    describe('Agents routes', () => {
        it('should return an OK status from the /agents route', async () => {
            const expectedStatusCode = 200
            const response = await request(app).get('/api/agents')

            expect(response.status).toEqual(expectedStatusCode)
        })

        it('should return a success message from the /agents route', async () => {
            const expectedBody = { message: `Agents successfully retrieved!` }
            const response = await request(app).get('/api/agents')

            expect(response.body.message).toEqual(expectedBody.message)
        })

        it('should return a JSON object from the /agents route', async () => {
            const response = await request(app).get('/api/agents')

            expect(response.type).toEqual('application/json')
        })

        it('should return a specific User-Agent based on provided ID', async () => {
            const expectedBody = { message: `Agent successfully retrieved!` }
            const response = await request(app).get('/api/agents/1')

            expect(response.body.message).toEqual(expectedBody.message)
        })

        it('should fail properly when given an invalid ID for /:id route', async () => {
            const expectedStatusCode = 500
            const response = await request(app).get('/api/agents/100')

            expect(response.status).toEqual(expectedStatusCode)
        })
    })
})