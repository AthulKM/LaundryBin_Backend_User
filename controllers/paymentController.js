import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


const createCheckoutSession = async (req, res) => {
  const { paymentMethod, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Your Product Name',
            },
            unit_amount: amount, // Convert amount to smallest unit (cents for USD, paise for INR)
          },
          quantity: 1,
        },
      ],
      success_url: 'https://ruperhat.com/wp-content/uploads/2020/06/Paymentsuccessful21.png',
      cancel_url: 'https://media.licdn.com/dms/image/C5112AQGiR7AdalYNjg/article-cover_image-shrink_600_2000/0/1582176281444?e=2147483647&v=beta&t=QVzBFLJpbDlQMX_H5iKXr7Jr1w6Pm60tOJb47rjpX6Q',
    });

    res.status(200).json({ id: session.id, success_url: session.success_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default createCheckoutSession;
