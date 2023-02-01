import { addProduct, getProducts } from './firebase.js'
import { popup } from './popup.js';

$(document).ready(function(){
    let name = window.location.href.split("?")[1]
    getProducts(name)
    $("#image-carousell").slick({
        arrows : false,
        dots : true,
        appendDots : $("#left-grid"),
        speed : 200,
    })
    $(".slick-dots > li > button").html("")

    // loops 50 times w 200ms intervals till item is found 
    let counter = 0
    let checker = setInterval(function(){
        let data = JSON.parse(localStorage.getItem('currentGuitar'))
        if (data !== null) {
            $("#name").text(`${data.name}`)
            $("#price").text(`$${data.price}`)
            $("#stars").text(`${data.stars}`)
            window.clearInterval(checker)
        } else {
            counter++
            console.log(counter)
        }
    },200)
      
       

    


})





