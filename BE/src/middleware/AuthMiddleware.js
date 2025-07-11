// src/middlewares/AuthMiddleware.js
export function verificarToken(request, reply, done) {
    const token = request.headers.authorization

    if (!token || token !== '1234') {
        return reply.code(401).send({ error: 'No autorizado' })
    }

    done() // continúa con la ruta
}
