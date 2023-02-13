import { loadProductPage } from './firebase.js'

$(document).ready(function(){
    let productId = window.location.href.split("?")[1]
    loadProductPage(productId)
})



