// src/routes/wahRoutes.js
export default function (fastify) {
  fastify.get('/wah', async (request, reply) => {
    return { message: 'GET /wah works!' }
  })

  fastify.post('/wah', async (request, reply) => {
    const body = request.body
    return { message: 'POST /wah received', data: body }
  })

  fastify.put('/wah/:id', async (request, reply) => {
    const { id } = request.params
    const body = request.body
    return { message: `PUT /wah/${id} received`, id, data: body }
  })

  fastify.delete('/wah/:id', async (request, reply) => {
    const { id } = request.params
    return { message: `DELETE /wah/${id} received`, id }
  })
}
