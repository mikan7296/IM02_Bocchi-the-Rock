import { loadProductPage } from './firebase.js'

$(document).ready(function(){
    //Gets the product Id from the window location and pass it into the function
    let productId = window.location.href.split("?")[1]
    loadProductPage(productId)
})



