import { encode } from "./firebase.js";

$(document).ready(function(){
    assignShippingEvents()
    renderCartSummary()
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

    $(".remove-button").click(function(e){
        let id = e.target.id
        $(`#card_${id}`).remove()
        let cart = JSON.parse(localStorage.getItem('cart'))
        let returnCart = []
        for (let k in cart) {
            let itemId = cart[k].itemId
            let itemName = cart[k].itemName
            let itemPrice = cart[k].itemPrice
            if (itemId != id) {
                console.log(cart[k])
                returnCart.push({'itemId' : itemId, 'itemName' : itemName, 'itemPrice' : itemPrice})
            }
        }
        localStorage.removeItem('cart')
        localStorage.setItem('cart',JSON.stringify(returnCart))
        if (cart.length == 1) {
            localStorage.removeItem('cart')
            location.reload()
        }
        renderCartSummary(false)
    })
}

function renderCartSummary(emptyContainer = true) {
    if (localStorage.cart) {
        let cart = JSON.parse(localStorage.getItem('cart'))
        let render = ''
        let totalPrice = 0
        
        for (let k in cart) {
            let v = cart[k]
            totalPrice += v.itemPrice
            let card = `
            <div id="card_${v.itemId}" class="flex py-5 max-h-20 pr-2">
                <div class="basis-1/5">
                    <img src="../media/b.png" class="h-12 w-12">
                </div>
                <div class="basis-3/5 text-base truncate">
                    <p>${v.itemName}</p>
                    <p class="pt-0.5 text-xs">Serial No: ${v.itemId}</p>
                </div>
                <div class="basis-1/5 font-bold truncate">
                    <p class="text-right">$${v.itemPrice}</p>
                    <p id="${v.itemId}" class="remove-button cursor-pointer text-xs text-right hover:text-red-500">Remove</p>
                </div>
            </div>`

            render += card
        }
       if (emptyContainer) {
            let container = $("#cart-container")
            container.empty()
            container.append(render)
       }
        
        $("#subtotal-price").text(`$${totalPrice}`)
        $("#total-price").attr('data-base-price',totalPrice)
        updateTotalPrice()
      

    } else {
        $("#cart-container").removeClass("border-b-2")
        $("#cart-section").removeClass("basis-2/3 max-w-[40%] border-l-2")
        $("#cart-section").addClass("w-full")
        $("#contact-section").hide()
        $("#cart-price-container").hide()

    }
}

function assignShippingEvents() {
    const sea = $("#sea-checkout")
    const air = $("#air-checkout")
    const ph = $("#shipping-price")
    ph.attr('data-price',0)
    $(sea).click(function(){
        let optionprice = 30
        ph.text(`$${optionprice}`)
        ph.attr('data-price',optionprice)
        updateTotalPrice()

    })
    $(air).click(function(){
        let optionprice = 60
        ph.text(`$${optionprice}`)
        ph.attr('data-price',optionprice)
        updateTotalPrice()
    })
}

function updateTotalPrice() {
    let basePrice = parseInt($("#total-price").attr('data-base-price'))
    let shippingPrice = parseInt($("#shipping-price").attr('data-price'))
    let newAmt = basePrice += shippingPrice
    $("#total-price").text(`$${newAmt}`)

}