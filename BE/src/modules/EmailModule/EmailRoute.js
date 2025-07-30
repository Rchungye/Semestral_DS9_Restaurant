// src/modules/EmailModule/EmailRoute.js
import { emailService } from './EmailService.js';
import { verificarAdmin } from '../../common/middleware/AuthMiddleware.js';

export const sendInvoiceEmail = async (request, reply) => {
    try {
        const invoiceData = request.body;

        // Validar datos requeridos
        const requiredFields = [
            'customerName', 'customerEmail', 'invoiceNumber',
            'orderNumber', 'items', 'total'
        ];

        const missingFields = requiredFields.filter(field => !invoiceData[field]);

        if (missingFields.length > 0) {
            return reply.code(400).send({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validar email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(invoiceData.customerEmail)) {
            return reply.code(400).send({
                success: false,
                error: 'Invalid email format'
            });
        }

        const result = await emailService.sendInvoiceEmail(invoiceData);

        if (result.success) {
            return reply.code(200).send({
                success: true,
                message: 'Invoice email sent successfully',
                data: result
            });
        } else {
            return reply.code(500).send({
                success: false,
                message: 'Failed to send invoice email',
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error in sendInvoiceEmail:', error);
        return reply.code(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Rutas públicas/internas
export function emailPublicRoutes(fastify) {
    // US-007 y US-010: Enviar factura electrónica después del pago exitoso
    fastify.post('/api/email/send-invoice', sendInvoiceEmail);
}

// Exportación por defecto (todas las rutas juntas)
export default function (fastify) {
    emailPublicRoutes(fastify);
}