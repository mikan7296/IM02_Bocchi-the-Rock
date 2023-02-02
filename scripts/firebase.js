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
const duplicateNames = []
const guitarData = []

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
            addStorage('currentGuitar',JSON.stringify(snapshot.val()))
        })
    } else {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `products/`)).then((snapshot) => {
            addStorage('products',JSON.stringify(snapshot.val()))
        })
    }
  
}
 

export function getDuplicateUsernames() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/`)).then((snapshot) => {
        for (const user in snapshot.val()) {
            duplicateNames.push(user.toUpperCase())
        }
    }).catch((error) => {
        console.error(error);
    });
    return duplicateNames
}

export function matchPassword(name,password) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/`)).then((snapshot) => {
       for (const user in snapshot.val()) {
            if ((snapshot.val()[user].name.toUpperCase() == name.toUpperCase()) && (password == snapshot.val()[user].password)) {
                login(snapshot.val()[user])
            }
        
       }
    }).catch((error) => {
        console.error(error);
    });
    return false
}

export function addUserData(name,password) {
    const db = getDatabase()
    set(ref(db, `users/${name.toUpperCase()}`), {
        name: name,
        password : password,
        id: Date.now(),
      });
}

export function addStorage(name,value) {
    localStorage.setItem(`${name}`,`${value}`)
}

export function logout() {
    const db = getDatabase()
    
    update(ref(db, `users/${localStorage.name.toUpperCase()}`), {
        cart : localStorage.getItem('cart')
    });

    localStorage.removeItem("name")
    localStorage.removeItem("cart")
    location.reload()
}

export function login(data) {
    addStorage("name",data.name)
    if (data.cart == null) {
        localStorage.removeItem('cart')
    } else {
       addStorage('cart',data.cart)
    }
    
    location.assign("./products.html")
}

$(document).ready(function(){
    $(".logout-button").click(function(e){
        logout()
    })
})