import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, get, push, child, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

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
                login(snapshot.val()[user].name)
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
        id: `${duplicateNames.length}`,
      });
}

export function addStorage(name,value) {
    localStorage.setItem(`${name}`,`${value}`)
}

export function logout() {
    localStorage.clear()
    location.reload()
}

export function login(name) {
    addStorage("name",name)
    location.assign("/index.html")
}

$(document).ready(function(){
    $("#logout").click(function(e){
        logout()
    })
})