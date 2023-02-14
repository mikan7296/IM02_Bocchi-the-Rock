import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, get, push, child, onValue, update, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { popup } from './popup.js';
import { updateTotalPrice } from './cart.js';
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

export function addProduct(name,price,brand,shape,thumbnail,images=false,sketchfab=false) {
    const db = getDatabase()
    push(ref(db, `products/`), {
        name: name,
        price: price,
        brand : brand,
        shape : shape,
        thumbnail : thumbnail,
        images : images,
        sketchfab : sketchfab,
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
                <div id="card_${totalItems}" class="" data-brand="${v.brand}" data-shape="${v.shape}">
                    <a href="guitar.html?${k}">
                        <div class="h-5/6 border-gray-400 border flex justify-center items-center">
                            <img class="h-[98%] w-[98%]" src="${v.thumbnail}">
                        </div>
                        <div class="h-1/6">
                            <h1 id="name_${k}" class="forNameSearch_${totalItems} text-lg font-semibold truncate">${v.name}</h1>
                            <h3 id="price_${k}" >$${v.price}</h3>
                        </div>
                    </a>
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
        let images = data.images
        let sketchfab = data.sketchfab
        let container = $("#image-carousell")
        if (images) {
            container.empty()
            for (let k in images) {
                let v = images[k]
                let card = `<img src="${v}" class="h-[600px] object-contain">`
                container.append(card)
            }
        }
        if (sketchfab) {
            let card  = `
            <div class="sketchfab-embed-wrapper"> <iframe class="w-4/5 mx-auto h-[600px]" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="${sketchfab}"> </iframe> </div>`   
            container.append(card)
        }
        initiateSlick()
        
        $("#product-name").text(data.name)
        // $("#product-material").text(data.material)
        // $("#product-finish").text(data.finish)

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

    function initiateSlick() {
        $("#image-carousell").slick({
            arrows : false,
            dots : true,
            appendDots : $("#left-grid"),
            speed : 200,
        })
        $(".slick-dots > li > button").html("")
    }
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
                localStorage.clear()
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
    removeVoucher($("#discount-price").attr("data-id"))
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
            $("#purchases-container").empty()
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
                        let card2 = `
                        <div class="w-full flex justify-between">
                            <span>${v3.itemName}</span>
                            <span>$${v3.itemPrice}</span>
                        </div>
                        `
                        $(`#item-container_${k}`).append(card2)
                    }
                    $(`#totalcoins_${k}`).text(`+${Math.round(totalCoins)}`)

                }
            }
        } else {
            let card = `
            <div id="purchases-container-empty" class="text-xl grid gap-2 justify-center">
                <div class="">
                    <p>You have yet to purchase anything!</p>
                </div>
                <div class="text-center">
                    <a href="products.html" id="" class=" bg-orange-300 hover:opacity-90 rounded-md px-8 py-1 cursor-pointer">Back to shop</a>
                </div>
            </div>`
            $("#purchases-container").append(card)
        }
    });
}

function addVoucher(discount,type,cost,limit=false) {
    const db = getDatabase()
    push(ref(db, `vouchers/`), {
        discount : discount,
        limit : limit,
        type : type,
        cost : cost
    })
}

function addUserVoucher(discount,type,cost,limit) {
    const db = getDatabase()
    push(ref(db, `users/${localStorage.userId}/vouchers`), {
        discount : discount,
        limit : limit,
        type : type,
        cost : cost
    })
}

export function getUserVouchers(usage=false) {
    const dbRef = ref(getDatabase(), `users/${localStorage.userId}/vouchers`);
    onValue(dbRef, (snapshot) => {
        let data = snapshot.val()
        if (data != null) {
            $("#no-vouchers-message").hide()
        } else {
            $("#no-vouchers-message").show()
        }
        renderUserVouchers(data)

        if (usage) {
            assignVoucherEvents(data)
        }
    })
}

function renderUserVouchers(data) {
    let container = $("#user-voucher-container")
    container.empty()
    for (let k in data) {
        let v = data[k]
        let card = 	`

        <div id="voucher_${k}" class="font-medium p-1 rounded-lg bg-black">
            <div class="p-0.5 rounded-md bg-yellow-200 h-full">
                <div class="p-1 rounded-md bg-black h-full">
                    <div class="p-2 rounded-md flex items-center text-white h-full">
                        <div class="basis-1/2 text-center">
                            <p id="voucher-value_${k}" class="text-5xl">$30</p>
                            <p id="voucher-cap_${k}"></p>
                        </div>
                        <div class="grow grid grid-rows-2">
                            <div>
                                <img src="../media/logo-white.png" class="mx-auto w-[48px] h-[40px]">
                            </div>
                            <div class="flex justify-center items-end">
                                <span class="text-xl">DISCOUNT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

        container.append(card)
        $(`#voucher-cost_${k}`).text(v.cost)
        if ((v.type == "m") && (v.limit != false)) {
            $(`#voucher-value_${k}`).text(`${v.discount}%`)
            $(`#voucher-cap_${k}`).text(`Capped at $${v.limit}`)
        } else {
            $(`#voucher-value_${k}`).text(`$${v.discount}`)
        }
    }
}

function assignVoucherEvents(data) {
    let voucherKeys = []
    for (let k in data) {
        voucherKeys.push(k)
        let v = data[k] 
        let currentVoucher = $(`#voucher_${k}`)
        let voucherPrice = $("#discount-price")
        currentVoucher.click(function(){
            if (currentVoucher.hasClass('opacity-30')) {
                voucherPrice.attr('data-type',false)
                voucherPrice.attr('data-id',false)
                removeExcept()
            } else {
                currentVoucher.addClass('opacity-30')
                voucherPrice.attr('data-price',v.discount)
                voucherPrice.attr('data-type',v.type)
                voucherPrice.attr('data-cap',v.limit)
                voucherPrice.attr('data-id',k)
                removeExcept(k)
            }
            updateTotalPrice()
          
        })
    }
    function removeExcept(key=false) {
        for (let k in voucherKeys) {
            let v = voucherKeys[k]
            if (key != v) {
                let voucher = $(`#voucher_${v}`)
                voucher.removeClass('opacity-30')
            }
        }
    }
}

function removeVoucher(id) {
    const dbRef = ref(getDatabase(), `users/${localStorage.userId}/vouchers/${id}`);
    onValue(dbRef, (snapshot) => {
        let data = snapshot.val()
        if (data) {
            remove(dbRef)
        }

    }, {
        onlyOnce: true
    })
}

export function getVouchers() {
    const dbRef = ref(getDatabase(), `vouchers/`);
    onValue(dbRef, (snapshot) => {
        let data = snapshot.val()
        renderVouchers(data)
        $(".voucher-redeem").click(function(){
            let voucherId = $(this).attr('id').split('_,_')[1]
            validateVoucher(voucherId)
        })

    })
}

function renderVouchers(data) {
    let container = $("#voucher-redeem-container")
    container.empty()
    for (let k in data) {
        let v = data[k]
        let card = 	`
        <div id="voucher_${k}" class="h-22 bg-red-200 p-2 rounded-md">
            <div class="col-span-2 flex flex-col justify-between text-center">
                <h1 class="text-xl font-bold h-8"><span id="voucher-value_${k}">5%</span> <span id="voucher-cap_${k}"></span></h1>
                <div class="grid grid-cols-2 h-12">
                    <div class="grid">
                        <div class="flex items-end justify-end gap-0.5 font-bold text-xl">
                            <p>Costs: </p>
                            <p id="voucher-cost_${k}">10</p>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-coins" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z"></path>
                                <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4"></path>
                                <path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z"></path>
                                <path d="M3 6v10c0 .888 .772 1.45 2 2"></path>
                                <path d="M3 11c0 .888 .772 1.45 2 2"></path>
                            </svg>
                        </div>																	
                    </div>
                    <div class="flex items-end justify-center">
                        <button id="voucher-redemption_,_${k}" class="voucher-redeem bg-orange-300 hover:opacity-90 rounded-md px-4 py-1 cursor-pointer">Redeem</button>
                    </div>
                </div>
            </div>
        </div>`
        container.append(card)
        $(`#voucher-cost_${k}`).text(v.cost)
        if (v.type == "m") {
            $(`#voucher-value_${k}`).text(`${v.discount}%`)
            $(`#voucher-cap_${k}`).text(`off capped at $${v.limit}`)
        } else {
            $(`#voucher-value_${k}`).text(`$${v.discount}`)
            $(`#voucher-cap_${k}`).text(`off`)
        }
    }
}

function validateVoucher(id) {
    const db = getDatabase()
    const dbRef = ref(db, `vouchers/${id}`);
    onValue(dbRef, (snapshot) => {
        let data = snapshot.val()
        if (data != null) {
            const dbRef = ref(getDatabase(), `users/${localStorage.userId}/coins`);
            onValue(dbRef, (snapshot) => {
                let coinData = snapshot.val();
                if (coinData >= data.cost) {
                    addCoins(data.cost*-1)
                    addUserVoucher(data.discount,data.type,data.cost,data.limit)
                } else {
                    popup('You are broke!','You do not have enough coins lol')
                }
            }, {
                onlyOnce: true
            })

        } else {
            popup('Error',`Voucher doesn't exist! Did you change something?`)
        }
    }, {
        onlyOnce: true
    })
}

$(document).ready(function(){
    $(".logout-button").click(function(e){
        logout()
    })
    updateProfileStats()

    
    $("#hehe").click(function(){
        let thumbnail = ['../media/guitars/thumbnail.png']
        let sketchfab = 'https://sketchfab.com/models/6277939ec397455ba811117793319032/embed?autospin=1&camera=0&ui_hint=0&ui_theme=dark'
        let images = ['../media/guitars/image.png','../media/guitars/thumbnail.png','../media/glp.png','../media/b2.png','../media/b.png']
        addProduct("Epiphone les paul",100,'epiphone','les paul',thumbnail,images,sketchfab)
        // addVoucher(100,'m',1)
    })
})
