// Author: Joshua Krasnogorov
// contains orders data retrieved from MySQL database
var express = require('express');
var router = express.Router();
var dbms = require('./dbms.js'); // Import the dbms module

/* POST orders listing. */
router.post('/', function(req, res, next) {
    // Get the month from the request body
    const selectedMonth = req.body.month;

    // Construct SQL query to join orders and toppings for the specified month
    const query = `
        SELECT t.name AS topping, o.quantity
        FROM orders o
        INNER JOIN toppings t ON o.t_id = t.t_id
        WHERE o.month = ${mysql.escape(selectedMonth)}
    `;

    // Execute the query using dbms.js
    dbms.dbquery(query, function(err, results) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error occurred' });
        }

        // Parse results into the desired format
        const orders = results.map(row => ({
            topping: row.topping,
            quantity: row.quantity
        }));

        // Return the JSON response
        res.json(orders);
    });
});

module.exports = router;