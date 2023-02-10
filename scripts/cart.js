import { userPayment, getUserVouchers } from "./firebase.js";

$(document).ready(function(){
    assignShippingEvents()
    renderCartSummary()
    assignRemoveButtons()
    assignInputEvent()
    assignPaymentEvents()
    getUserVouchers(true)
});


function assignRemoveButtons() {

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
        $("#cart-section").removeClass("lg:col-span-2 lg:border-l-2").addClass("lg:col-span-5")
        $("#contact-section").hide()
        $("#cart-price-container").hide()
        $("#checkout-submit-container").hide()

    }
}

function assignShippingEvents() {
    const shipOption1 = $("#shipping-method-option1")
    const shipOption2 = $("#shipping-method-option2")
    const shipOption3 = $("#shipping-method-option3")
    const ph = $("#shipping-price")
    ph.attr('data-price',0)
    $(shipOption1).click(function(){
        let optionprice = shipOption1.data('value')
        ph.text(`$${optionprice}`)
        ph.attr('data-price',optionprice)
        updateTotalPrice()
    })
    $(shipOption2).click(function(){
        let optionprice = shipOption2.data('value')
        ph.text(`$${optionprice}`)
        ph.attr('data-price',optionprice)
        updateTotalPrice()
    })
    $(shipOption3).click(function(){
        let optionprice = shipOption3.data('value')
        ph.text(`$${optionprice}`)
        ph.attr('data-price',optionprice)
        updateTotalPrice()
    })
}

export function updateTotalPrice() {
    let basePrice = parseInt($("#total-price").attr('data-base-price'))
    let shippingPrice = parseInt($("#shipping-price").attr('data-price'))
    let voucherPrice = parseInt($("#discount-price").attr('data-price'))
    let voucherType = $("#discount-price").attr('data-type')
    let voucherCap = $("#discount-price").attr('data-cap')
    let discount = 0

    if (voucherType == "m") {
        $("#discount-price").text(`-${voucherPrice}%`)
        discount = (100-voucherPrice)/100
        if ((basePrice*(1-discount)) >= voucherCap) {
            basePrice -= voucherCap
        } else {
            basePrice *= discount
        }
    } else if (voucherType == 'a') {
        $("#discount-price").text(`-$${voucherPrice}`)
        discount = voucherPrice*-1
        basePrice += discount
    } else {
        $("#discount-price").text("Not applied")
    }

    let newAmt = basePrice += shippingPrice
    $("#total-price").text(`$${newAmt}`)
}

function assignInputEvent() {
    const email = $("#email-checkout")
    const shipOption1 = $("#shipping-method-option1")
    const shipOption2 = $("#shipping-method-option2")
    const shipOption3 = $("#shipping-method-option3")
    const firstName = $("#first-name-checkout")
    const lastName = $("#last-name-checkout")
    const address = $("#address-checkout")
    const address2 = $("#address2-checkout")
    const postal = $("#postal-checkout")
    const method = $("#shipping-information-method")
    let inputsFields = [email,firstName,lastName,address,postal]
    let inputOptions = [shipOption1,shipOption2,shipOption3]
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
    $("#checkout-submit").click(function(e){
        e.preventDefault()
        $("#shipping-information-email").text(email.val())
        $("#shipping-information-address").text([address.val(),address2.val()].join(' '))

        if (shipOption1.is(':checked')) {
            method.text("DHL Air Economy - $30")
        } else if (shipOption2.is(':checked')) {
            method.text("Fedex International Economy - $60")
        } else { 
            method.text("Fedex International Priority - $100")
        }
        togglePayment()
    })

    function validate() {
        let empty = 0
        if (!$("input:radio[name='shipping-method']").is(":checked")) {
            empty++
        }
        if (email.val().length != 0) {
            if (email.val().includes('@') && email.val().includes('.com')) {
                $(email).removeClass('border-red-600').addClass('border-gray-600')
                $("#email-checkout-error").addClass('hidden').removeClass('block')
            } else {
                $(email).addClass('border-red-600').removeClass('border-gray-600')
                $("#email-checkout-error").addClass('block').removeClass('hidden')
                empty++
            }
        } else {
            $(email).removeClass('border-red-600').addClass('border-gray-600')
            $("#email-checkout-error").addClass('hidden').removeClass('block')
        }
       
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

    $(".change-information").click(function(e){
        togglePayment()
    })

    $(ppOption).click(function(e){
        hideContent(gpayContent)
        hideContent(ccContent)
        showContent(ppContent)
    })
    $(gpayOption).click(function(e){
        hideContent(ccContent)
        hideContent(ppContent)
        showContent(gpayContent)

    })
    $(ccOption).click(function(e){
        hideContent(ppContent)
        hideContent(gpayContent)
        showContent(ccContent)
    })
    
    $("#payment-popup-pay").click(function(){
        $("#payment-popup-pay").attr('disabled',true)
        $("#payment-popup-main").toggleClass("scale-0 scale-100")
        setTimeout(function(){
            $("#payment-popup-lottie").toggleClass("hidden flex")
        },500)
        setTimeout(function(){
            $("#payment-popup-lottie").toggleClass("hidden grid")
            $("#payment-popup-lottie-done").toggleClass("hidden grid")
        },2000)

        if (localStorage.userId) {
            let basePrice = parseInt($("#total-price").attr('data-base-price'))
            userPayment(Math.round(basePrice/10))
            $("#payment-popup-lottie-done-message").removeClass('hidden')
        }
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
   
function togglePayment() {
    window.scrollTo(0,0)
    $("#payment-popup").toggleClass('h-0 h-full')
    $("#bg-dark").toggleClass('hidden')
    $('body').toggleClass('overflow-hidden')
}

