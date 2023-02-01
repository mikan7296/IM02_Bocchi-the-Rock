import { getProducts } from './firebase.js'

$(document).ready(function () {
    getProducts()

    checkLocalStorage("products",50,100)

    let products = JSON.parse(localStorage.getItem('products'))
    let totalItems = 0

    for (let k in products) {
        let v = products[k]
        let card = 
            `
            <div id="card_${totalItems}" class="container px-2 h-fit">
                <a href="guitar.html?${k}">
                <div class="m-2 mt-8 p-2 h-72 bg-orange-300 rounded-lg shadow-xl">
                    <img class="w-full h-3/5 object-fill" src="../media/burger.jfif">
                    <div class="h-2/5 grid grid-rows-2">
                        <h1 id="name_${k}" class="forNameSearch_${totalItems} text-lg font-semibold truncate">${v.name}</h1>
                        <h3 id="price_${k}" >$${v.price}</h3>
                    </div>
                </div></a>
            </div>
            `
        let container = $("#card-container")
        container.append(card)
        totalItems++
    }
});

function checkLocalStorage(target,iterations,delay) {
    let counter = 0
    let checker = setInterval(function(){
        let products = JSON.parse(localStorage.getItem(target))
        if (products !== null) {
            
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