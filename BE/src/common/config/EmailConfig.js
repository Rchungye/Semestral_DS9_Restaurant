// src/common/config/EmailConfig.js
import nodemailer from 'nodemailer';

class EmailConfig {
    constructor() {
        this.transporter = null;
        this.init();
    }

    init() {
        try {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER || 'ratchung@gmail.com',
                    pass: process.env.EMAIL_PASSWORD || 'kafh xwik msvc vxne'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            console.log('✅ Email transporter configured successfully');
        } catch (error) {
            console.error('❌ Error configuring email transporter:', error);
            throw error;
        }
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email server connection verified');
            return true;
        } catch (error) {
            console.error('❌ Email server connection failed:', error);
            return false;
        }
    }

    getTransporter() {
        if (!this.transporter) {
            throw new Error('Email transporter not initialized');
        }
        return this.transporter;
    }

    // Default email configuration
    getDefaultOptions() {
        return {
            from: {
                name: 'Golden Panda Restaurant',
                address: process.env.EMAIL_USER || 'ratchung@gmail.com'
            },
            replyTo: process.env.EMAIL_USER || 'ratchung@gmail.com'
        };
    }
}

export const emailConfig = new EmailConfig();