// Author: Joshua Krasnogorov
// contains orders data retrieved from MySQL database
var express = require('express');
var router = express.Router();
var dbms = require('./dbms.js');
var mysql = require('mysql');

/* POST orders listing. */
router.post('/', function(req, res, next) {
    // get the month from the request body
    const selectedMonth = req.body.month;
    console.log("Selected month:", selectedMonth);

    // convert month name to month number
    const monthMap = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    
    const monthNumber = monthMap[selectedMonth];
    console.log("Month number:", monthNumber);

    // construct SQL query to join orders and toppings for the specified month
    const query = `
        SELECT * FROM orders WHERE MONTH = ${mysql.escape(monthNumber)};`;

    // execute the query using dbms.js
    dbms.dbquery(query, function(err, results) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error occurred' });
        }

        // parse results into the desired format
        const orders = results.map(row => ([{
            topping: row.topping, quantity: row.quantity
        }]));

        // return the JSON response
        res.json(JSON.stringify(orders));
    });
});

module.exports = router;