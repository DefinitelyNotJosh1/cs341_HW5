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

        // aggregate quantities for the same topping type
        const toppingMap = {};
        
        // group by topping and sum quantities
        results.forEach(row => {
            const toppingId = row.t_id;
            if (!toppingMap[toppingId]) {
                toppingMap[toppingId] = 0;
            }
            toppingMap[toppingId] += parseInt(row.quantity);
        });
        
        // convert the aggregated map to an array of objects
        const aggregatedOrders = Object.keys(toppingMap).map(toppingId => ({
            topping: parseInt(toppingId),
            quantity: toppingMap[toppingId]
        }));

        console.log(aggregatedOrders);
        // return the JSON response with aggregated data
        res.json(aggregatedOrders);
    });
});

module.exports = router;