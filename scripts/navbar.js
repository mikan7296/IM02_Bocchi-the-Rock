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
        console.log("a")
        $("#cartdropdownMenu").toggleClass("scale-0 scale-100")
        $("#dropdownMenu").removeClass("scale-100")
        $("#dropdownMenu").addClass("scale-0")


    })

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

function checkLoginStatus() {
    if (localStorage.name) {
        $("#logged-in").removeClass("hidden")
        $("#logged-out").addClass("hidden")

    }
}