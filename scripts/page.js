import { loadProductPage } from './firebase.js'

$(document).ready(function(){
    let productId = window.location.href.split("?")[1]
    loadProductPage(productId)
    initiateSlick()

})

function initiateSlick() {
    $("#image-carousell").slick({
        arrows : false,
        dots : true,
        appendDots : $("#left-grid"),
        speed : 200,
    })
    $(".slick-dots > li > button").html("")
}



