import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderEmail } from '../services/emailService.js';
import { generateOrderPDF } from '../services/pdfService.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const { customer, items, notes } = req.body;

    // Calculate totals
    let netTotal = 0;
    let grossTotal = 0;
    let totalDiscount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.productId}` });
      }

      const itemNet = product.priceNet * item.quantity;
      const itemGross = product.priceGross * item.quantity;
      const itemDiscount = itemNet * (product.discount / 100);

      netTotal += itemNet - itemDiscount;
      grossTotal += itemGross - (itemGross * (product.discount / 100));
      totalDiscount += itemDiscount;
    }

    const vatTotal = grossTotal - netTotal;

    const order = new Order({
      customer,
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        unitPriceNet: item.netPrice,
        unitPriceGross: item.grossPrice,
        discount: item.discount
      })),
      totals: {
        net: netTotal,
        vat: vatTotal,
        gross: grossTotal,
        discount: totalDiscount
      },
      notes
    });

    await order.save();
    await order.populate('items.product');

    // Send emails
    await sendOrderEmail(order, 'customer');
    await sendOrderEmail(order, 'admin');

    // Generate PDF
    const pdfBuffer = await generateOrderPDF(order);

    res.status(201).json({
      success: true,
      order: order,
      pdfUrl: `/api/orders/${order._id}/pdf`
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const pdfBuffer = await generateOrderPDF(order);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=order-${order.orderNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;