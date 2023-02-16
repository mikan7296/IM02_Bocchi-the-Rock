import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, push, onValue, update, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
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

export function addProduct(name,price,brand,shape,thumbnail,material,finish,images=false,sketchfab=false) {
    const db = getDatabase()
    push(ref(db, `products/`), {
        name: name,
        price: price,
        brand : brand,
        shape : shape,
        thumbnail : thumbnail,
        material : material,
        finish : finish,
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
                            <img class="h-full aspect-[10/16]" src="${v.thumbnail}">
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
                let card = `<img src="${v}" class="h-[580px] object-contain">`
                container.append(card)
            }
        }
        if (sketchfab) {
            let card  = `
            <div class="sketchfab-embed-wrapper"> <iframe class="w-4/5 mx-auto h-[580px]" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="${sketchfab}"> </iframe> </div>`   
            container.append(card)
        }
        initiateSlick()
        
        $(".product-name").text(data.name)
        $(".product-material").text(data.material)
        $(".product-finish").text(data.finish)
        $(".product-price").text(`$${data.price}`)

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
        setTimeout(function(){
            popup('Login Failed!','Incorrect Credentials')
        },2000)
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
        $("#purchases-container").empty()
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
                            <span class="capitalize">${v3.itemName}</span>
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
        currentVoucher.addClass('cursor-pointer')
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
        <div id="voucher_${k}" class="h-22 bg-black text-white p-1 rounded-lg">
            <div class="h-full w-full bg-yellow-200 rounded-md p-0.5">
                <div class="h-full w-full bg-black rounded-md py-2">
                    <div class="col-span-2 flex flex-col justify-between text-center">
                        <h1 class="text-xl font-bold h-8"><span id="voucher-value_${k}">5%</span> <span id="voucher-cap_${k}"></span></h1>
                        <div class="grid grid-cols-2 h-12">
                            <div class="grid">
                                <div class="flex items-end justify-end gap-0.5 font-bold text-xl">
                                    <p>Costs: </p>
                                    <p id="voucher-cost_${k}">10</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 44 39">
                                        <defs>
                                            <pattern id="pattern" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 664 600">
                                            <image width="664" height="600" xlink:href="data:image/png;base64,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"/>
                                            </pattern>
                                        </defs>
                                        <rect id="IP_coin-13-13" data-name="IP coin-13-13" width="44" height="39" fill="url(#pattern)"/>
                                        </svg>
                                </div>																	
                            </div>
                            <div class="flex items-end justify-center">
                                <button id="voucher-redemption_,_${k}" class="voucher-redeem bg-orange-300 hover:opacity-90 rounded-md px-4 py-1 cursor-pointer text-black font-bold">Redeem</button>
                            </div>
                        </div>
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
                    popup('You are broke!','You do not have enough coins lol',true)
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

export function updateUserData(type,name,password) {
    const db = getDatabase()
    if (type == 'pw') {
        update(ref(db, `users/${localStorage.userId}`), {
            password : password
        });
    } else if (type == 'name') {
        update(ref(db, `users/${localStorage.userId}`), {
            displayName : name,
            name : name.toUpperCase(),
        });
    } else {
        update(ref(db, `users/${localStorage.userId}`), {
            displayName : name,
            name : name.toUpperCase(),
            password : password
        });
    }
    

}

$(document).ready(function(){
    $(".logout-button").click(function(e){
        logout()
    })
    updateProfileStats()

    
    // $("span").click(function(){
    //     let name ='Epiphone Flying V Prophecy'
    //     let price = 899
    //     let brand = 'epiphone'
    //     let shape = 'flying v'
    //     let thumbnail = ['../media/guitars/jingxuan/front.jpg']
    //     let material = 'mahogany'
    //     let finish = 'yellow tiger aged gloss'
    //     let sketchfab = 'https://sketchfab.com/models/f57e9510d1b04945a0a917baebfe4df1/embed'
    //     let images = ['../media/guitars/jingxuan/front.jpg','../media/guitars/jingxuan/back.jpg','../media/guitars/jingxuan/top.png','../media/guitars/jingxuan/side.png']
    //     addProduct(name,price,brand,shape,thumbnail,material,finish,images,sketchfab)
    //     // addVoucher(100,'m',1)
    // })
})
