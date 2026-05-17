
import dotenv from 'dotenv';
dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = 'e.com.hori@gmail.com';
const ADMIN_EMAIL = 'e.com.hori@gmail.com';

const sendBrevoEmail = async (to, subject, htmlContent) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { email: SENDER_EMAIL, name: "Horizon Store" },
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlContent
            })
        });
        
        if (!response.ok) {
            const errBody = await response.text();
            console.error("Brevo Email Failed:", errBody);
        } else {
            console.log(`Email sent successfully to ${to}`);
        }
    } catch (err) {
        console.error("Email send fail:", err);
    }
};

export const sendOrderEmail = async (order, user, items) => {
    const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);
    const gst = (order.total_price * 0.18).toFixed(2); // Mock 18% GST

    const receiptHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4CAF50; margin: 0;">Horizon</h1>
                <p style="color: #666; font-size: 14px;">Thank you</p>
            </div>
            
            <p style="color: #333; font-size: 16px;">Someone made a purchase from <strong>Horizon</strong> for you.</p>
            
            <div style="margin: 20px 0; border-top: 1px solid #eee; padding-top: 20px;">
                <p style="margin: 5px 0; color: #555;"><strong>Order number:</strong> HORZ-${order.id.slice(0, 8).toUpperCase()}</p>
                <p style="margin: 5px 0; color: #555;"><strong>Order date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="border-bottom: 1px solid #eee;">
                        <th style="text-align: left; padding: 10px; color: #666; font-size: 14px;">Item</th>
                        <th style="text-align: right; padding: 10px; color: #666; font-size: 14px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(it => `
                        <tr style="border-bottom: 1px solid #f9f9f9;">
                            <td style="padding: 10px; font-size: 14px; color: #333;">${it.products.title} (x${it.quantity})</td>
                            <td style="padding: 10px; text-align: right; font-size: 14px; color: #333;">₹${(it.price_at_order * it.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="margin-top: 20px; text-align: right; border-top: 2px solid #eee; padding-top: 10px;">
                <p style="margin: 5px 0; font-size: 16px;"><strong>Total: ₹${order.total_price.toFixed(2)}</strong></p>
                <p style="margin: 5px 0; font-size: 12px; color: #999;">(Includes GST of ₹${gst})</p>
            </div>

            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
                <p style="margin: 5px 0;"><strong>Payment method:</strong> ${order.payment_method}</p>
                <p style="margin: 5px 0;"><strong>Shipping Address:</strong> ${order.address}</p>
            </div>
        </div>
    `;

    const adminHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>New Order Placed!</h2>
            <p><strong>Order ID:</strong> HORZ-${order.id.slice(0, 8).toUpperCase()}</p>
            <p><strong>Total:</strong> ₹${order.total_price.toFixed(2)}</p>
            <p><strong>Customer:</strong> ${user.email}</p>
            <br/>
            <p>Your new order has been placed. Admin, log in and then check the order and also confirm it.</p>
            <p><em>Require network settings to be in the E commerce site.</em></p>
        </div>
    `;

    await sendBrevoEmail(user.email, `Thank you for your purchase - Order #${order.id.slice(0, 8)}`, receiptHtml);
    await sendBrevoEmail(ADMIN_EMAIL, `New Order Alert: #${order.id.slice(0, 8)}`, adminHtml);
};

export const sendOrderStatusUpdateEmail = async (userEmail, orderId, newStatus) => {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2 style="color: #4CAF50;">Order Update</h2>
            <p>Your order <strong>#HORZ-${orderId.slice(0, 8).toUpperCase()}</strong> has a new status.</p>
            <h3 style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${newStatus}</h3>
            <p>Thank you for shopping at Horizon!</p>
        </div>
    `;
    await sendBrevoEmail(userEmail, `Your Order Status is now: ${newStatus}`, htmlContent);
};

export const sendProductNotificationEmail = async (userEmail, productTitle, isDiscount = false) => {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2196F3;">${isDiscount ? 'New Discount Available!' : 'New Product Uploaded!'}</h2>
            <p>Check out our latest update: <strong>${productTitle}</strong></p>
            <p>Visit Horizon Store to see more.</p>
        </div>
    `;
    await sendBrevoEmail(userEmail, isDiscount ? 'Exclusive Discount at Horizon' : 'New Product Alert from Horizon', htmlContent);
};

export const sendWelcomeEmail = async (userEmail) => {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2 style="color: #4CAF50;">Welcome to Horizon!</h2>
            <p>We're excited to have you on board. Start exploring our latest products and deals today.</p>
            <p>Happy Shopping!</p>
        </div>
    `;
    await sendBrevoEmail(userEmail, 'Welcome to Horizon Store!', htmlContent);
};
