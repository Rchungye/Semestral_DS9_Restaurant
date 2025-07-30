// src/modules/EmailModule/EmailService.js
import { emailConfig } from '../../common/config/EmailConfig.js';
import { generateInvoiceHTML, generateOrderConfirmationText } from '../../common/helpers/EmailTemplates.js';

export class EmailService {
    constructor() {
        this.transporter = emailConfig.getTransporter();
        this.defaultOptions = emailConfig.getDefaultOptions();
    }

    async sendInvoiceEmail(invoiceData) {
        try {
            const htmlContent = generateInvoiceHTML(invoiceData);
            const textContent = generateOrderConfirmationText(invoiceData);

            const mailOptions = {
                ...this.defaultOptions,
                to: {
                    name: invoiceData.customerName,
                    address: invoiceData.customerEmail
                },
                subject: `🐼 Factura Electrónica #${invoiceData.invoiceNumber} - Golden Panda`,
                html: htmlContent,
                text: textContent,
                attachments: [],
                headers: {
                    'X-Mailer': 'Golden Panda Restaurant System',
                    'X-Priority': '1',
                    'X-MSMail-Priority': 'High',
                    'Importance': 'high'
                }
            };

            const result = await this.transporter.sendMail(mailOptions);

            return {
                success: true,
                messageId: result.messageId,
                response: result.response,
                timestamp: new Date().toISOString(),
                recipient: invoiceData.customerEmail
            };

        } catch (error) {
            console.error('Error sending invoice email:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
                recipient: invoiceData.customerEmail
            };
        }
    }

}

export const emailService = new EmailService();