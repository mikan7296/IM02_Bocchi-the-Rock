import { addProduct, getProducts } from './firebase.js'
import { popup } from './popup.js';

$(document).ready(function(){
    let name = window.location.href.split("?")[1.].replaceAll("%20"," ")

    getProducts(name)
    checkLocalStorage('currentGuitar',50,200)
    initiateSlick()

    

})

function checkLocalStorage(target,iterations,delay) {
    let counter = 0
    let checker = setInterval(function(){
        let data = JSON.parse(localStorage.getItem(target))
        if (data !== null) {
            $("#name").text(`${data.name}`)
            $("#price").text(`$${data.price}`)
            $("#stars").text(`${data.stars}`)
            window.clearInterval(checker)
        } else {
            counter++
            console.log(counter)
        }
        if (counter > iterations) {
            window.clearInterval(checker)
        }
    },delay)
}

function initiateSlick() {
    $("#image-carousell").slick({
        arrows : false,
        dots : true,
        appendDots : $("#left-grid"),
        speed : 200,
    })
    $(".slick-dots > li > button").html("")
}





