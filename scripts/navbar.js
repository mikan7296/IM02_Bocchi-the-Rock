$(document).ready(function() {
    
    $("#dropdownButton").click(function (e) {
        console.log("hi")
        $("#dropdownMenu").toggleClass("hidden")
    })

    $("#mobile-hamburger-dropdown").click(function (e) {
        $("#sidebar").removeClass("w-0")
        $("#sidebar").addClass("w-full")
        console.log("W")

    })

    $("#sidebar-close-button").click(function() {
        hideSidebar()
    })

    $(window).resize(function(e) {
        if ($(window).width() >= 768) {
           hideSidebar()
        }
    })

    $("#dropdownButton").text(`${localStorage.name}`)
})

function hideSidebar() {
    $("#sidebar").addClass("w-0")
    $("#sidebar").removeClass("w-full")
}

