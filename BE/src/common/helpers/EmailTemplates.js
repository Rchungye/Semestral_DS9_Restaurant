// src/common/helpers/EmailTemplates.js

export const generateInvoiceHTML = (invoiceData) => {
    const {
        customerName,
        customerEmail,
        invoiceNumber,
        orderNumber,
        orderType,
        tableNumber,
        items,
        subtotal,
        tax,
        total,
        orderDate,
        estimatedTime
    } = invoiceData;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PA', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('es-PA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura Electrónica - Golden Panda</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #ff6b35, #f7931e);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            
            .logo {
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            
            .restaurant-name {
                font-size: 1.8em;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .tagline {
                font-size: 1em;
                opacity: 0.9;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .invoice-info {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 25px;
                border-left: 4px solid #ff6b35;
            }
            
            .invoice-info h2 {
                color: #ff6b35;
                margin-bottom: 15px;
                font-size: 1.4em;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .info-item {
                display: flex;
                flex-direction: column;
            }
            
            .info-label {
                font-weight: bold;
                color: #666;
                font-size: 0.9em;
                margin-bottom: 3px;
            }
            
            .info-value {
                color: #333;
                font-size: 1em;
            }
            
            .order-type-badge {
                display: inline-block;
                background-color: ${orderType === 'local' ? '#28a745' : '#007bff'};
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.8em;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .items-section {
                margin-bottom: 25px;
            }
            
            .items-section h3 {
                color: #333;
                margin-bottom: 15px;
                font-size: 1.3em;
                border-bottom: 2px solid #ff6b35;
                padding-bottom: 8px;
            }
            
            .item {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 15px 0;
                border-bottom: 1px solid #eee;
            }
            
            .item:last-child {
                border-bottom: none;
            }
            
            .item-details {
                flex: 1;
            }
            
            .item-name {
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
            }
            
            .item-customizations {
                font-size: 0.9em;
                color: #666;
                margin-bottom: 3px;
            }
            
            .item-observations {
                font-size: 0.8em;
                color: #888;
                font-style: italic;
            }
            
            .item-price {
                font-weight: bold;
                color: #ff6b35;
                white-space: nowrap;
                margin-left: 15px;
            }
            
            .quantity {
                background-color: #ff6b35;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8em;
                font-weight: bold;
                margin-right: 10px;
            }
            
            .totals {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 25px;
            }
            
            .total-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 1em;
            }
            
            .total-row.final {
                border-top: 2px solid #ff6b35;
                padding-top: 12px;
                margin-top: 12px;
                font-weight: bold;
                font-size: 1.2em;
                color: #ff6b35;
            }
            
            .message {
                background: linear-gradient(135deg, #e8f5e8, #f0f8ff);
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #28a745;
                margin-bottom: 25px;
            }
            
            .message h3 {
                color: #28a745;
                margin-bottom: 10px;
            }
            
            .estimated-time {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 12px;
                margin-top: 15px;
                text-align: center;
            }
            
            .estimated-time .icon {
                font-size: 1.2em;
                margin-right: 8px;
            }
            
            .footer {
                background-color: #333;
                color: white;
                padding: 25px 20px;
                text-align: center;
            }
            
            .footer-content {
                margin-bottom: 15px;
            }
            
            .contact-info {
                font-size: 0.9em;
                opacity: 0.8;
                margin-bottom: 10px;
            }
            
            .social-links {
                margin-top: 15px;
            }
            
            .social-links a {
                color: #ff6b35;
                text-decoration: none;
                margin: 0 10px;
                font-weight: bold;
            }
            
            @media (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
                
                .item {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .item-price {
                    margin-left: 0;
                    margin-top: 8px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">🐼</div>
                <div class="restaurant-name">Golden Panda</div>
                <div class="tagline">Sabores Auténticos de Asia</div>
            </div>
            
            <!-- Content -->
            <div class="content">
                <!-- Invoice Information -->
                <div class="invoice-info">
                    <h2>📧 Factura Electrónica</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Número de Factura:</span>
                            <span class="info-value">#${invoiceNumber}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Número de Orden:</span>
                            <span class="info-value">#${orderNumber}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Cliente:</span>
                            <span class="info-value">${customerName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${customerEmail}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Fecha:</span>
                            <span class="info-value">${formatDate(orderDate)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Tipo de Pedido:</span>
                            <span class="info-value">
                                <span class="order-type-badge">
                                    ${orderType === 'local' ? '🍽️ Para Consumir en Local' : '🥡 Para Llevar'}
                                </span>
                            </span>
                        </div>
                    </div>
                    ${tableNumber ? `
                        <div class="info-item">
                            <span class="info-label">Mesa:</span>
                            <span class="info-value">Mesa #${tableNumber}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Order Items -->
                <div class="items-section">
                    <h3>🍜 Detalles del Pedido</h3>
                    ${items.map(item => `
                        <div class="item">
                            <div class="item-details">
                                <div class="item-name">
                                    <span class="quantity">${item.quantity}</span>
                                    ${item.name}
                                </div>
                                ${item.customizations ? `
                                    <div class="item-customizations">
                                        <strong>Personalización:</strong> ${item.customizations}
                                    </div>
                                ` : ''}
                                ${item.observations ? `
                                    <div class="item-observations">
                                        <strong>Observaciones:</strong> ${item.observations}
                                    </div>
                                ` : ''}
                            </div>
                            <div class="item-price">${formatCurrency(item.totalPrice)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Totals -->
                <div class="totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>${formatCurrency(subtotal)}</span>
                    </div>
                    <div class="total-row">
                        <span>Impuestos (7%):</span>
                        <span>${formatCurrency(tax)}</span>
                    </div>
                    <div class="total-row final">
                        <span>TOTAL:</span>
                        <span>${formatCurrency(total)}</span>
                    </div>
                </div>
                
                <!-- Success Message -->
                <div class="message">
                    <h3>✅ ¡Pago Exitoso!</h3>
                    <p>Tu pedido ha sido confirmado y procesado correctamente. Nuestro equipo de cocina ya está preparando tu deliciosa comida.</p>
                    
                    ${estimatedTime ? `
                        <div class="estimated-time">
                            <span class="icon">⏰</span>
                            <strong>Tiempo estimado de preparación: ${estimatedTime} minutos</strong>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Additional Info -->
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #1976d2; margin-bottom: 10px;">📋 Información Importante:</h4>
                    <ul style="margin-left: 20px; color: #555;">
                        ${orderType === 'local' ? `
                            <li>Tu pedido será entregado en la <strong>Mesa #${tableNumber}</strong></li>
                            <li>Por favor mantente en tu mesa para recibir tu orden</li>
                        ` : `
                            <li>Tu pedido estará listo para recoger en <strong>${estimatedTime || 20} minutos</strong></li>
                            <li>Presenta tu <strong>número de factura #${invoiceNumber}</strong> al recoger</li>
                        `}
                        <li>Si tienes alguna pregunta, no dudes en contactarnos</li>
                    </ul>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div class="footer-content">
                    <strong>Golden Panda Restaurant</strong><br>
                    Sabores Auténticos de Asia
                </div>
                <div class="contact-info">
                    📍 Panamá, Panamá<br>
                    📞 +507 XXXX-XXXX<br>
                    📧 ratchung@gmail.com
                </div>
                <div style="margin-top: 15px; font-size: 0.8em; opacity: 0.7;">
                    © 2025 Golden Panda Restaurant. Todos los derechos reservados.<br>
                    Esta es una factura electrónica generada automáticamente.
                </div>
                <div class="social-links">
                    <a href="#">Facebook</a>
                    <a href="#">Instagram</a>
                    <a href="#">WhatsApp</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const generateOrderConfirmationText = (invoiceData) => {
    const {
        customerName,
        invoiceNumber,
        orderNumber,
        orderType,
        tableNumber,
        total,
        estimatedTime
    } = invoiceData;

    return `
¡Hola ${customerName}!

Tu pedido en Golden Panda ha sido confirmado exitosamente.

DETALLES DEL PEDIDO:
- Número de Factura: #${invoiceNumber}
- Número de Orden: #${orderNumber}
- Tipo: ${orderType === 'local' ? 'Para Consumir en Local' : 'Para Llevar'}
${tableNumber ? `- Mesa: #${tableNumber}` : ''}
- Total: $${total.toFixed(2)}
${estimatedTime ? `- Tiempo estimado: ${estimatedTime} minutos` : ''}

${orderType === 'local'
            ? `Tu pedido será entregado en tu mesa. ¡Gracias por elegirnos!`
            : `Tu pedido estará listo para recoger en ${estimatedTime || 20} minutos. Presenta tu número de factura al recoger.`
        }

¡Gracias por elegir Golden Panda!
Sabores Auténticos de Asia

---
Golden Panda Restaurant
Panama, Panama
Email: ratchung@gmail.com
    `.trim();
};