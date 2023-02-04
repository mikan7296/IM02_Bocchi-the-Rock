import { encode } from "./firebase.js";

$(document).ready(function(){
    assignShippingEvents()
    renderCartSummary()
    assignEvents()
    assignInputEvent()
    assignPaymentEvents()
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
        $("#checkout-submit-container").hide()

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

function assignInputEvent() {
    const email = $("#email-checkout")
    const seaOption = $("#sea-checkout")
    const airOption = $("#air-checkout")
    const firstName = $("#first-name-checkout")
    const lastName = $("#last-name-checkout")
    const address = $("#address-checkout")
    const postal = $("#postal-checkout")
    let inputsFields = [email,firstName,lastName,address,postal]
    let inputOptions = [seaOption,airOption]
    for (let k in inputsFields) {
        (inputsFields[k]).keyup(function() {
           validate()
        })
    }
    for (let k in inputOptions) {
        (inputOptions[k]).click(function() {
           validate()
        })
    }

    function validate() {
        let empty = 0
        if (($("#air-checkout").is(':checked')) || ($("#sea-checkout").is(':checked'))) {
        } else {return}

        for (let k in inputsFields) {
            if ((inputsFields[k].val().length == 0)) {
                empty++
            }
        }
        if (empty == 0) {
            $("#checkout-submit").removeAttr('disabled')
        } else {$("#checkout-submit").attr('disabled',true)}
    }
}

function assignPaymentEvents() {
    const ppContent = $("#payment-paypal-content")
    const gpayContent = $("#payment-googlepay-content")
    const ccContent = $("#payment-creditcard-content")

    const ppOption = $("#payment-paypal-option")
    const gpayOption = $("#payment-googlepay-option")
    const ccOption = $("#payment-creditcard-option")

    $(ppOption).click(function(e){
        console.log('pp')
        hideContent(gpayContent)
        hideContent(ccContent)
        showContent(ppContent)
    })
    $(gpayOption).click(function(e){
        console.log('gp')
        hideContent(ccContent)
        hideContent(ppContent)
        showContent(gpayContent)

    })
    $(ccOption).click(function(e){
        console.log('cc')
        hideContent(ppContent)
        hideContent(gpayContent)
        showContent(ccContent)
    })


    function showContent(arg1) {
        arg1.addClass("max-h-40 py-4 border-t border-gray-400")
        arg1.removeClass("max-h-0")

    }
    function hideContent(arg1) {
        arg1.addClass("max-h-0")
        arg1.removeClass("max-h-40 py-4 border-t border-gray-400")
    }

}
   

    

