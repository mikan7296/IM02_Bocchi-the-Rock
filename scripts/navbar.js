$(document).ready(function() {
 
    assignEvents()
    checkLoginStatus()
    $("#name-Placeholder").text(`${localStorage.name}`)
})

function hideSidebar() {
    $("#sidebar").addClass("w-0")
    $("#sidebar").removeClass("w-full")
}

function assignEvents() {
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

    $("#add-to-cart").click(function(){
        setTimeout(function(){
            renderCartDropdown()
        },500)
    });

    $("#mobile-hamburger-dropdown").click(function (e) {
        $("#sidebar").removeClass("w-0")
        $("#sidebar").addClass("w-full")

    })

    $("#sidebar-close-button").click(function() {
        hideSidebar()
    })

    $(window).resize(function(e) {
        if ($(window).width() >= 768) {
           hideSidebar()
        }
    })
}

function renderCartDropdown() {
    if (localStorage.cart) {
        $("#empty-cart").addClass("hidden")
        $("#not-empty-cart").removeClass("hidden")

        let cart = JSON.parse(localStorage.getItem('cart'))
        let render = ''
        let totalPrice = 0

        for (let k in cart) {
            let v = cart[k]
            totalPrice += v.itemPrice
            let card = `
            <div data="" class="grid grid-cols-6 grid-rows-1 gap-2">
                <p class="col-span-4 truncate">${v.itemName}</p>
                <p class="">$${v.itemPrice}</p>
                <p class="text-center text-red-600 font-bold">&times;</p>
            </div>`
            render += card
        }
        let container = $("#cart-dropdown-container")
        $("#cart-total-price").text(`$${totalPrice}`)
        container.empty()
        container.append(render)

    } else {
        $("#empty-cart").removeClass("hidden")
        $("#not-empty-cart").addClass("hidden")
    }
}

function checkLoginStatus() {
    if (localStorage.name) {
        $("#logged-in").removeClass("hidden")
        $("#logged-out").addClass("hidden")

    }
}