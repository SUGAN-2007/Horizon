import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendOrderEmail = async (order, user, items) => {
    const adminEmail = 'e.com.hori@gmail.com';
    const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);
    const gst = (order.total_price * 0.18).toFixed(2); // Mock 18% GST

    const mailOptions = {
        from: `"Horizon Store" <${process.env.MAIL_USER}>`,
        to: `${user.email}, ${adminEmail}`,
        subject: `Thank you for your purchase - Order #${order.id.slice(0, 8)}`,
        html: `
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

            <div style="margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
                <p>&copy; 2026 Horizon E-com. All rights reserved.</p>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Emails sent successfully to user and admin");
    } catch (err) {
        console.error("Email send fail:", err);
    }
};
