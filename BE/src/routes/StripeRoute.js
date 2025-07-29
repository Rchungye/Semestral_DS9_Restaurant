import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default function stripeRoutes(fastify) {
  fastify.post('/api/stripe/create-checkout-session', async (request, reply) => {
    const { cartItems, note } = request.body;
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cartItems.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              ...(note && note.trim() && { description: note }), // Solo agrega si hay nota
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });
      reply.send({ url: session.url });
    } catch (err) {
      console.error('Stripe error:', err);
      reply.code(500).send({ error: err.message });
    }
  });
}