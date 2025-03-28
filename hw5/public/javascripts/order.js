// Author: Joshua Krasnogorov
// JavaScript/JQuery code for ordering

$(document).ready(function(){
    $("#orderButton").click(function(){
        // get textArea and check for "vegan"
        var textAreaNotes = $("#notes").val();
        var word = "vegan";
        if (textAreaNotes.toLowerCase().includes("vegan")) {
            // alert user that cheesecake contains dairy
            alert("The cheesecake contains dairy!");
        } else {
            // get order details
            var quantity = $("#quantity").val();
            var topping = $("input[name='toppings']:checked").val();
            
            // Send POST request to add order to database
            $.post('/neworder', {
                quantity: quantity,
                topping: topping,
                notes: textAreaNotes
            }, function(response) {
                console.log('Order added to database:', response);
            }).fail(function(error) {
                console.error('Error adding order to database:', error);
            });
            
            // hide order segments
            $('#orderTable').hide();
            $('#notes').hide();
            $('#notesLabel').hide();
            $('#orderButton').hide();

            $('#orderConfirmation').html("Thank you! Your order has been placed");
            $('#orderConfirmationInfo').html("Topping: " + topping + "<br>Quantity: " + quantity + "<br>Notes:<br>" + textAreaNotes);
        }
    });
});