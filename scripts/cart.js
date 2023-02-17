import { userPayment, getUserVouchers } from "./firebase.js";

$(document).ready(function(){
    assignShippingEvents()
    renderCartSummary()
    assignRemoveButtons()
    assignInputEvent()
    assignPaymentEvents()
    getUserVouchers(true)
});

//To assign remove buttons functionality in the cart
function assignRemoveButtons() {
    $(".remove-button").click(function(e){
        //Get button Id (it's the same as the item Id in cart)
        let id = e.target.id
        $(`#card_${id}`).remove() //Remove it visually
        let cart = JSON.parse(localStorage.getItem('cart'))
        let returnCart = []
        //To get all the current items in the cart except the one removed
        for (let k in cart) {
            let itemId = cart[k].itemId
            let itemName = cart[k].itemName
            let itemPrice = cart[k].itemPrice
            if (itemId != id) {
                returnCart.push({'itemId' : itemId, 'itemName' : itemName, 'itemPrice' : itemPrice})
            }
        }
        //Remove the entire cart, replace with returnCart which will include all items except the one replaced
        localStorage.removeItem('cart')
        localStorage.setItem('cart',JSON.stringify(returnCart))
        //If there's only 1 item left reload the page(which will show empty cart message)
        if (cart.length == 1) {
            localStorage.removeItem('cart')
            location.reload()
        }
        renderCartSummary(false) //Render cart summary without emptying container
    })
}
//To render cart summary
function renderCartSummary(emptyContainer = true) {
    if (localStorage.cart) {
        let cart = JSON.parse(localStorage.getItem('cart'))
        let render = ''
        let totalPrice = 0
        //For all items create a card for it and add to final render, also sums total price
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
        //To empty container and add render if emptyContainer is true
       if (emptyContainer) {
            let container = $("#cart-container")
            container.empty()
            container.append(render)
       }
        //To update the subtotal price
        $("#subtotal-price").text(`$${totalPrice}`)
        //To update the total price data
        $("#total-price").attr('data-base-price',totalPrice)
        updateTotalPrice()
      
    //If nothing in cart, hide stuff and show empty cart message
    } else {
        $("#cart-container").removeClass("border-b-2")
        $("#cart-section").removeClass("lg:col-span-2 lg:border-l-2").addClass("lg:col-span-5")
        $("#contact-section").hide()
        $("#cart-price-container").hide()
        $("#checkout-submit-container").hide()

    }
}
//To assign shipping method events, works by changing #shipping-price data-price to the amount and calling updateTotalPrice()
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
//To update total price using data
export function updateTotalPrice() {
    let basePrice = parseInt($("#total-price").attr('data-base-price'))
    let shippingPrice = parseInt($("#shipping-price").attr('data-price'))
    let voucherPrice = parseInt($("#discount-price").attr('data-price'))
    let voucherType = $("#discount-price").attr('data-type')
    let voucherCap = $("#discount-price").attr('data-cap')
    let discount = 0
    //If multiplicative
    if (voucherType == "m") {
        //Change discount price text to '-XX%'
        $("#discount-price").text(`-${voucherPrice}%`)
        //Maths for calculating discount
        discount = (100-voucherPrice)/100
        //If above voucher limit set discount amount to the limit else use the formula above
        if ((basePrice*(1-discount)) >= voucherCap) {
            basePrice -= voucherCap
        } else {
            basePrice *= discount
        }
    //If additive
    } else if (voucherType == 'a') {
        //Change discount price text to '-$XX'
        $("#discount-price").text(`-$${voucherPrice}`)
        //Maths for calculating discount
        discount = voucherPrice*-1
        basePrice += discount
    //If not applied
    } else {
        $("#discount-price").text("Not applied")
    }
    //Change total price text
    let newAmt = Math.round(basePrice += shippingPrice)
    $("#total-price").text(`$${newAmt}`)
}
//To assign input events for minor validations(email and empty fields)
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
    //For assigning keyup event to all input fields
    for (let k in inputsFields) {
        (inputsFields[k]).keyup(function() {
           validate()
        })
    }
    //For assigning click event to all input options
    for (let k in inputOptions) {
        (inputOptions[k]).click(function() {
           validate()
        })
    }
    //Submit button click event
    $("#checkout-submit").click(function(e){
        e.preventDefault()
        //Get values
        $("#shipping-information-email").text(email.val())
        $("#shipping-information-address").text([address.val(),address2.val()].join(' '))
        //Check shipping method chosen
        if (shipOption1.is(':checked')) {
            method.text("DHL Air Economy - $30")
        } else if (shipOption2.is(':checked')) {
            method.text("Fedex International Economy - $60")
        } else { 
            method.text("Fedex International Priority - $100")
        }
        togglePayment()
    })
    //To validate form submission
    function validate() {
        //Counter to check for errors 0 = good else bad
        let empty = 0
        //If none of shipping methods are chosen, add to empty
        if (!$("input:radio[name='shipping-method']").is(":checked")) {
            empty++
        }
        //If email length is not 0, check it
        if (email.val().length != 0) {
            //If includes @ + .com, remove red borders and error message
            if (email.val().includes('@') && email.val().toLowerCase().includes('.com')) {
                $(email).removeClass('border-red-600').addClass('border-gray-600')
                $("#email-checkout-error").addClass('hidden').removeClass('block')
            //If doesn't include @ + .com, show red borders and error message, also add to empty
            } else {
                $(email).addClass('border-red-600').removeClass('border-gray-600')
                $("#email-checkout-error").addClass('block').removeClass('hidden')
                empty++
            }
        //If email is not entered, remove error message
        } else {
            $(email).removeClass('border-red-600').addClass('border-gray-600')
            $("#email-checkout-error").addClass('hidden').removeClass('block')
        }
        //If any of the input fields are empty, add to empty
        for (let k in inputsFields) {
            if ((inputsFields[k].val().length == 0)) {
                empty++
            }
        }
        //If empty is 0 after all the validations, enable checkout submit button, else disable
        if (empty == 0) {
            $("#checkout-submit").removeAttr('disabled')
        } else {$("#checkout-submit").attr('disabled',true)}
    }
}
//To assign events to the payment popup
function assignPaymentEvents() {
    const ppContent = $("#payment-paypal-content")
    const gpayContent = $("#payment-googlepay-content")
    const ccContent = $("#payment-creditcard-content")

    const ppOption = $("#payment-paypal-option")
    const gpayOption = $("#payment-googlepay-option")
    const ccOption = $("#payment-creditcard-option")
    //If change button is clicked hide popup
    $(".change-information").click(function(e){
        togglePayment()
    })
    //Paypal option
    $(ppOption).click(function(e){
        hideContent(gpayContent)
        hideContent(ccContent)
        showContent(ppContent)
    })
    //Google pay option
    $(gpayOption).click(function(e){
        hideContent(ccContent)
        hideContent(ppContent)
        showContent(gpayContent)

    })
    //Credit card option
    $(ccOption).click(function(e){
        hideContent(ppContent)
        hideContent(gpayContent)
        showContent(ccContent)
    })
    //When 'pay' is clicked
    $("#payment-popup-pay").click(function(){
        //Disable the button
        $("#payment-popup-pay").attr('disabled',true)
        //Hide the main part(the summary and payment option)
        $("#payment-popup-main").toggleClass("scale-0 scale-100")
        //Show the lottie part after 500ms
        setTimeout(function(){
            $("#payment-popup-lottie").toggleClass("hidden flex")
        },500)
        //Hide the lottie part after 2 secs and show done message
        setTimeout(function(){
            $("#payment-popup-lottie").toggleClass("hidden flex")
            $("#payment-popup-lottie-done").toggleClass("hidden grid")
        },2000)
        //If logged in, run userPayment()
        if (localStorage.userId) {
            let basePrice = parseInt($("#total-price").attr('data-base-price'))
            userPayment(Math.round(basePrice/10))
        }
    })
    //To show the content card by changing max height
    function showContent(arg1) {
        arg1.addClass("max-h-40 py-4 border-t border-gray-400")
        arg1.removeClass("max-h-0")

    }
    //To hide the content card by changing max height
    function hideContent(arg1) {
        arg1.addClass("max-h-0")
        arg1.removeClass("max-h-40 py-4 border-t border-gray-400")
    }

}
//To toggle the payment popup
function togglePayment() {
    window.scrollTo(0,0)
    $("#payment-popup").toggleClass('h-0 h-full')
    $("#bg-dark").toggleClass('hidden')
    $('body').toggleClass('overflow-hidden')
}

