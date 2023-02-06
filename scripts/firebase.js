import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, get, push, child, onValue, update} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

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

export function addProduct(name,price) {
    const db = getDatabase()
    push(ref(db, `products/`), {
        name: name,
        price: price,
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
                <div id="card_${totalItems}" class="container px-2 h-fit">
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

// export function getDuplicateUsernames() {
//     const dbRef = ref(getDatabase());
//     get(child(dbRef, `users/`)).then((snapshot) => {
//         const data = snapshot.val()
//         let emptyArray = []
//         for (const userID in data) {
//             emptyArray.push(data[`${userID}`].name)
//             localStorage.setItem('existingUsernames',emptyArray)
//         }
//     }).catch((error) => {
//         console.error(error);
//     });
// }

export function getDuplicateUsernames() {
    const dbRef = ref(getDatabase(), 'users/');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data != null) {
            let emptyArray = []
            for (const userID in data) {
                let userData = data[userID]
                emptyArray.push(userData.name)
                localStorage.setItem('existingUsernames',emptyArray)
            } 
        }
        
    });
}

export function matchPassword(name,password) {
    const dbRef = ref(getDatabase(), 'users/');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        for (const userID in data) {
            let userData = data[userID]
            if ((userData.name == encrypt(name.toUpperCase())) && (password == userData.password)) {
                login(userID,userData)
            }
        }
    });
    return false
}

// export function matchPassword(name,password) {
//     const dbRef = ref(getDatabase());
//     get(child(dbRef, `users/`)).then((snapshot) => {
//        for (const user in snapshot.val()) {
//             if ((snapshot.val()[user].name.toUpperCase() == name.toUpperCase()) && (password == snapshot.val()[user].password)) {
//                 login(snapshot.val()[user])
//             }
//        }
//     }).catch((error) => {
//         console.error(error);
//     });
//     return false
// }

export function addUserData(name,password) {
    const db = getDatabase()
    let id = Date.now()
    set(ref(db, `users/${id}`), {
        name: encrypt(name.toUpperCase()),
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

function updateProfileDropdown() {
    if (localStorage.userId) {
        const dbRef = ref(getDatabase(), `users/${localStorage.userId}`);
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                $("#name-Placeholder").text(data.displayName)
                $("#coin-Placeholder").text(data.coins)
            }   
            
    })
    }   
}

export function userPayment() {
    const db = getDatabase()
    let usercart = localStorage.getItem('cart')
    push(ref(db, `users/${localStorage.userId}/purchasehistory`), {
        purchases : localStorage.getItem('cart')
    })
    localStorage.removeItem('cart')
}

export function getPurchaseHistory() {
    const dbRef = ref(getDatabase(), `users/${localStorage.userId}/purchasehistory`);
    onValue(dbRef, (snapshot) => {
        console.log(snapshot.val())
    });
}

$(document).ready(function(){
    $(".logout-button").click(function(e){
        logout()
    })

    $(window).bind('beforeunload', function(){
        localStorage.removeItem('existingUsernames')
    });
    updateProfileDropdown()
    $("#name-Placeholder").click(function(){
        addProduct('Guitar 4',400)
    })
})

export const encrypt = (string) => window.btoa(string)
export const decrypt = (string) => window.atob(string)