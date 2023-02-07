import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, get, push, child, onValue, update} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { popup } from './popup.js';

const firebaseConfig = {
    apiKey: "AIzaSyDXbZe3Yr00ZOcOGZVTQ5x9UmMYcT-ht08",
    authDomain: "np-y1s2-ip.firebaseapp.com",
    databaseURL: "https://np-y1s2-ip-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "np-y1s2-ip",
    storageBucket: "np-y1s2-ip.appspot.com",
    messagingSenderId: "408648419436",
    appId: "1:408648419436:web:0ee6f6a2495e38383ab049"
  };
const app = initializeApp(firebaseConfig);

export function addProduct(name,price,tags,viewer=false) {
    const db = getDatabase()
    push(ref(db, `products/`), {
        name: name,
        price: price,
        tags : tags,
        viewer : viewer,
        stars: 0,
      });
}

export function getProducts() {
    const dbRef = ref(getDatabase(), `products`);
    onValue(dbRef, (snapshot) => {
        let container = $("#card-container")
        const data = snapshot.val();
        container.empty()
        let totalItems = 0
        for (let k in data) {
            let v = data[k]
            let card = 
                `
                <div id="card_${totalItems}" class="container px-2 h-fit" data-tags="${v.tags}">
                    <a href="guitar.html?${k}">
                    <div class="m-2 mt-8 p-2 h-72 bg-orange-300 rounded-lg shadow-xl">
                        <img class="w-full h-3/5 object-fill rounded-lg" src="../media/burger.jfif">
                        <div class="h-2/5 grid grid-rows-2">
                            <h1 id="name_${k}" class="forNameSearch_${totalItems} text-lg font-semibold truncate">${v.name}</h1>
                            <h3 id="price_${k}" >$${v.price}</h3>
                        </div>
                    </div></a>
                </div>
                `
            container.append(card)
            totalItems++
        }
    })
}

export function loadProductPage(productId) {
    const dbRef = ref(getDatabase(), `products/${productId}`);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        
        $("#product-name").text(data.name)
        $("#product-stars").text(data.stars)
        $("#product-price").text(`$${data.price}`)

        $("#add-to-cart").click(function(){
            let cart = []
            if(localStorage.cart){
                cart = JSON.parse(localStorage.cart);
            }
            cart.push({'itemId' : Date.now(), 'itemName' : data.name, 'itemPrice' : data.price});
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    }) 
}

export function checkDuplicateUsernames(name,password) {
    const dbRef = ref(getDatabase(), 'users/');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        let duplicate = false
        let duplicateNames = []
        for (let k in data) {
            let v = data[k]
            duplicateNames.push(v.name)
        }
        for (let k in duplicateNames) {
            let v = duplicateNames[k]
            if (name.toUpperCase() == v) {
                duplicate = true
            }
        }
        if (!duplicate) {
            addUserData(name,password)
        } else {
            setTimeout(function(){
                popup('Duplicate Name!',`Username ${name} is taken!`)
            },1000)  
        }
    });
}

export function matchPassword(name,password) {
    const dbRef = ref(getDatabase(), 'users/');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        for (let userId in data) {
            let userData = data[userId]
            if ((userData.name == name.toUpperCase()) && (password == userData.password)) {
                login(userId,userData)
            }
        }
        popup('Login Failed!','Incorrect Credentials')
    });
}

export function addUserData(name,password) {
    const db = getDatabase()
    let id = Date.now()
    set(ref(db, `users/${id}`), {
        name: name.toUpperCase(),
        displayName : name,
        password : password,
        coins: 0,
      });
    login(id)
}

export function logout() {
    const db = getDatabase()
    update(ref(db, `users/${localStorage.userId}`), {
        cart : localStorage.getItem('cart')
    });

    localStorage.removeItem("userId")
    localStorage.removeItem("cart")
    location.reload()
}

export function login(id,data=false) {
    localStorage.setItem("userId",id)
    if (data) {
        if (data.cart == null) {
            localStorage.removeItem('cart')
        } else {
           localStorage.setItem('cart',data.cart)
        }
    }
    location.assign("./products.html")
}

function updateProfileStats() {
    if (localStorage.userId) {
        const dbRef = ref(getDatabase(), `users/${localStorage.userId}`);
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            $(".name-placeholder").text(data.displayName)
            $(".coin-placeholder").text(data.coins)
            $(".userid-placeholder").text(localStorage.userId)
            $(".tier-placeholder").text()
        })
    }   
}

export function userPayment(amount) {
    const db = getDatabase()
    push(ref(db, `users/${localStorage.userId}/purchasehistory`), {
        purchases : localStorage.getItem('cart')
    })
    addCoins(amount)
    $("#payment-popup-lottie-done-message-coins").text(`${amount}`)
    localStorage.removeItem('cart')
}

function addCoins(amount) {
    const db = getDatabase()
    const dbRef = ref(db, `users/${localStorage.userId}/coins`);
    onValue(dbRef, (snapshot) => {
       let coins = snapshot.val()
       update(ref(db, `users/${localStorage.userId}`), {
        coins : coins += amount
    })
    }, {
        onlyOnce: true
    })
}

export function getPurchaseHistory() {
    const dbRef = ref(getDatabase(), `users/${localStorage.userId}/purchasehistory`);
    onValue(dbRef, (snapshot) => {
        let data = snapshot.val()
        if (data != null) {
            for (let k in data) {
                let v = data[k]
                let card =`
                <div id="container_${k}" class="bg-gray-200 rounded-md p-4 text-xl">
                    <div class="flex justify-between">
                        <div>
                            <span>Transaction ID:</span>
                            <span>${k}</span>
                        </div>
                        <div class="flex items-center gap-0.5">
                            <p id="totalcoins_${k}" class="font-bold">+0</p>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-coins" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z"></path>
                                <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4"></path>
                                <path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z"></path>
                                <path d="M3 6v10c0 .888 .772 1.45 2 2"></path>
                                <path d="M3 11c0 .888 .772 1.45 2 2"></path>
                            </svg>
                        </div>
                    </div>
                    <div id="item-container_${k}">

                    <div>
                </div>`
                $("#purchases-container").append(card)

                for (let k2 in v) {
                    let v2 = JSON.parse(v[k2])
                    let totalCoins = 0
                    for (let k3 in v2) {
                        let v3 = v2[k3]
                        totalCoins += v3.itemPrice/10
                        console.log(totalCoins)
                        let card2 = `
                        <div class="w-full flex justify-between">
                            <span>${v3.itemName}</span>
                            <span>$${v3.itemPrice}</span>
                        </div>
                        `
                        $(`#item-container_${k}`).append(card2)
                    }
                    $(`#totalcoins_${k}`).text(`+${totalCoins}`)

                }
            }
        } else {
            $("#purchases-container-empty").toggleClass("hidden grid")
        }
    });
}

$(document).ready(function(){
    $(".logout-button").click(function(e){
        logout()
    })

    $(window).bind('beforeunload', function(){
        localStorage.removeItem('existingUsernames')
    });
    updateProfileStats()
  
})

export const encrypt = (string) => window.btoa(string)
export const decrypt = (string) => window.atob(string)