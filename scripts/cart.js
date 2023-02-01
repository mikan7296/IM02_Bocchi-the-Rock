$(document).ready(function(){
    assignEvents()
    localStorage.removeItem('cart')


});



function assignEvents() {
    $("#add-to-cart").click(function(){
        let cart = []

        let details = JSON.parse(localStorage.currentGuitar)
        if(localStorage.cart){
            cart = JSON.parse(localStorage.cart);
        }
        cart.push({'itemName' : details.name, 'itemPrice' : details.price});
        localStorage.setItem('cart', JSON.stringify(cart));
        
        let x = JSON.parse(localStorage.getItem('cart'))
        console.log(x)
    });
}