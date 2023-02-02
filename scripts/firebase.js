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
    set(ref(db, `products/${name.toUpperCase()}`), {
        name: name,
        price: price,
        stars: 0,
        
      });
}

export function getProducts(name) {
    if (name) {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `products/${name}`)).then((snapshot) => {
            localStorage.setItem('currentGuitar',JSON.stringify(snapshot.val()))
        })
    } else {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `products/`)).then((snapshot) => {
            localStorage.setItem('products',JSON.stringify(snapshot.val()))
        })
    }
  
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
            if ((userData.name == encode(name.toUpperCase())) && (password == userData.password)) {
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
        name: encode(name.toUpperCase()),
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

$(document).ready(function(){
    $(".logout-button").click(function(e){
        logout()
    })

    $(window).bind('beforeunload', function(){
        localStorage.removeItem('existingUsernames')
    });
    updateProfileDropdown()
})

export const encode = (string) => window.btoa(string)
export const decode = (string) => window.atob(string)