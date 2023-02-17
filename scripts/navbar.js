$(document).ready(function() {
    assignEvents()
    checkLoginStatus()
})
//To hide the sidebar on mobile
function hideSidebar() {
    $("#sidebar").addClass("w-0")
    $("#sidebar").removeClass("w-full")
}
//Assigning events
function assignEvents() {
    //Dropdown events
    $("#dropdownButton").click(function (e) {
        $("#dropdownMenu").toggleClass("scale-0 scale-100")
        $("#cartdropdownMenu").removeClass("scale-100")
        $("#cartdropdownMenu").addClass("scale-0")
    })

    $("#cartdropdownButton").click(function (e) {
        $("#cartdropdownMenu").toggleClass("scale-0 scale-100")
        $("#dropdownMenu").removeClass("scale-100")
        $("#dropdownMenu").addClass("scale-0")
        renderCartDropdown()
    })
    //To rerender cart dropdown after adding to cart with 500ms delay
    $("#add-to-cart").click(function(){
        setTimeout(function(){
            renderCartDropdown()
        },500)
    });
    //Show mobile sidebar 
    $("#mobile-hamburger-dropdown").click(function (e) {
        $("#sidebar").removeClass("w-0")
        $("#sidebar").addClass("w-full")
    })
    //Hide mobile sidebar
    $("#sidebar-close-button").click(function() {
        hideSidebar()
    })
    //If resize to pc hide sidebar
    $(window).resize(function(e) {
        if ($(window).width() >= 768) {
           hideSidebar()
        }
    })
}
//To show items in the cart in the cart dropdown on PC
function renderCartDropdown() {
    if (localStorage.cart) {
        $("#empty-cart").addClass("hidden")
        $("#not-empty-cart").removeClass("hidden")

        let cart = JSON.parse(localStorage.getItem('cart'))
        let render = ''
        let totalPrice = 0
        //Loops through localStorage cart and add to render, also sums total price 
        for (let k in cart) {
            let v = cart[k]
            totalPrice += v.itemPrice
            let card = `
            <div class="grid grid-cols-6 grid-rows-1 gap-2">
                <p class="col-span-4 truncate">${v.itemName}</p>
                <p class="">$${v.itemPrice}</p>
            </div>`
            render += card
        }
        let container = $("#cart-dropdown-container")
        //Change total price
        $("#cart-total-price").text(`$${totalPrice}`)
        //Empty cart dropdown container and append render to it
        container.empty()
        container.append(render)
    //If nothing in cart show empty cart message
    } else {
        $("#empty-cart").removeClass("hidden")
        $("#not-empty-cart").addClass("hidden")
    }
}
//If logged in show navigation menu else show login/signup menu
function checkLoginStatus() {
    if (localStorage.userId) {
        $(".logged-in").removeClass("hidden")
        $(".logged-out").addClass("hidden")
    } 
}