$(document).ready(function(){
    assignEvents()
});


function assignEvents() {
    $("#add-to-cart").click(function(){
        let cart = []

        let details = JSON.parse(localStorage.currentGuitar)
        if(localStorage.cart){
            cart = JSON.parse(localStorage.cart);
        }
        cart.push({'itemId' : Date.now(), 'itemName' : details.name, 'itemPrice' : details.price});
        localStorage.setItem('cart', JSON.stringify(cart));
    });
}
