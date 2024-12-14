const Order = require('../models/order');

exports.placeOrder = async (req, res) => {
    try {
        const { sellerId, productName, price, category, quantity } = req.body;

        // Step 1: Check if an order exists for the same seller and product
        
            // Step 3: If the order does not exist, create a new order
            const newOrder = new Order({
                sellerId,
                productName,
                price,
                category,
                quantity
            });

            await newOrder.save();
        

        res.status(200).send('Order placed successfully');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Error placing order');
    }
};


exports.getSalesReport = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Fetch orders for the specified sellerId
        const details = await Order.find({ sellerId });

        // Format the sales data
        const formattedSalesData = details.map(order => ({
            ...order._doc // Spread all fields from the order document
        }));

        // Respond with the formatted sales data
        res.status(200).json(formattedSalesData);
    } catch (error) {
        console.error('Error fetching sales report:', error);
        res.status(500).send('Error fetching sales report');
    }
};


exports.getTotalSales = async (req,res) => {
    try {
        const { username } = req.params;
        let total = 0
        let qty = 0
        // Fetch orders for the specified sellerId
        const products = await Order.find({sellerId:username})
        products.forEach(product => {
            total += parseInt(product.price) * parseInt(product.quantity)
            qty += parseInt(product.quantity)
        })
        res.status(200).json({total,qty})

    }
    catch(err){
        console.log(err)
        res.send(500).json({message:"Internal Server Error"})
    }
}
