// Author: Joshua Krasnogorov
// JavaScript/JQuery code for dropdown, Credit to ChatGPT for outline

$(document).ready(function() {
    var defaultMonth = 'Jan'; // default month
        $('#dropdownButton').text(defaultMonth); // set default month
    
    // enable scrolling with mouse wheel when hovering over the dropdown
    $('.dropdown-content').on('mousewheel DOMMouseScroll', function(e) {
        var scrollTo = null;
        if (e.type === 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -1);
        } else if (e.type === 'DOMMouseScroll') {
            scrollTo = 40 * e.originalEvent.detail;
        }
        if (scrollTo) {
            e.preventDefault();
            $(this).scrollTop(scrollTo + $(this).scrollTop());
        }
    });

    // set selected month and issue POST when an item is clicked
    $('.dropdown-content a').click(function(event) {
        event.preventDefault(); // prevent default link behavior
        var selectedMonth = $(this).data('value'); // get the data-value attribute
        $('#dropdownButton').text(selectedMonth); // update the button text

        // handle POST
        $.post('/orders', { month: selectedMonth }, function(data) {

            // get order list and clear it
            var ordersList = $('#ordersList');
            ordersList.empty();

            data.forEach(function(order) {
                var orderItem = $('<li></li>').text(order.quantity + ' ' + order.topping);
                ordersList.append(orderItem);
            });
        });
    });
});