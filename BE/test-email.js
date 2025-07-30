// test-email.js
import nodemailer from 'nodemailer';

async function testEmail() {
    try {
        console.log('Creando transporter...');

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'ratchung@gmail.com',
                pass: 'kafh xwik msvc vxne'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        console.log('Verificando conexión...');
        await transporter.verify();
        console.log('✅ Conexión verificada exitosamente');

        console.log('Enviando email de prueba...');
        const info = await transporter.sendMail({
            from: '"Golden Panda 🐼" <ratchung@gmail.com>',
            to: 'ratchung@gmail.com',
            subject: '🧪 Test Email - Golden Panda',
            text: 'Este es un email de prueba desde Golden Panda!',
            html: `
                <h1>🐼 Golden Panda Test</h1>
                <p>Este es un email de prueba desde el sistema Golden Panda.</p>
                <p><strong>¡Todo está funcionando correctamente!</strong></p>
            `
        });

        console.log('✅ Email enviado exitosamente');
        console.log('Message ID:', info.messageId);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testEmail();