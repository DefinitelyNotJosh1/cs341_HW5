// Author: Joshua Krasnogorov
// Route for handling new order submissions
var express = require('express');
var router = express.Router();
var dbms = require('./dbms.js');
var mysql = require('mysql');

/* POST new order. */
router.post('/', function(req, res, next) {
    // get order details from request body
    const quantity = req.body.quantity;
    const topping = req.body.topping;
    const notes = req.body.notes;
    
    // determine T_ID based on topping
    let t_id;
    if (topping === 'plain') {
        t_id = 1;
    } else if (topping === 'cherry') {
        t_id = 2;
    } else if (topping === 'chocolate') {
        t_id = 3;
    } else {
        return res.status(400).json({ error: 'Invalid topping' });
    }
    
    // generate a random valid month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    
    // construct SQL query to insert new order
    const query = `
        INSERT INTO orders (T_ID, QUANTITY, NOTES, MONTH, YEAR)
        VALUES (${mysql.escape(t_id)}, ${mysql.escape(quantity)}, ${mysql.escape(notes)}, ${mysql.escape(randomMonth)}, 2023)
    `;
    
    // execute the query using dbms.js
    dbms.dbquery(query, function(err, results) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        
        // return success response
        res.json({ success: true, message: 'Order added successfully' });
    });
});

module.exports = router; 