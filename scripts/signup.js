import { popup } from './popup.js';
import { getDuplicateUsernames, addUserData, login } from './firebase.js'

let duplicateNames = []

$(document).ready(function () {
    duplicateNames = getDuplicateUsernames()
    $("#eye1, #eye2").click(function (e){
        togglePassword()
    })
   
    $("#submitbtn").click(function (e) {
        e.preventDefault();
        const name = $("#name-input").val();
        const password = $("#pw-input").val();

        if (validateInputs(name,password)) {
            if (matchUsername(name)) {
                addUserData(name,password)
                login(name)
            }
        }
    });

});

function togglePassword() {
    if ($("#pw-input").attr("type") == "password") {
        $("#pw-input").attr("type","text")
    } else {$("#pw-input").attr("type","password")}

    $("#eye2").toggleClass("hidden")
    $("#eye1").toggleClass("hidden")
}

function validateInputs(name,password) {

    if (name == "" || password == "") {
        popup("Error - Empty Fields","Please do not leave the fields empty")
    }
    else if (checkWhiteSpace(name)) {
        $("#name-error").toggleClass("invisible")
    }
    else if (checkWhiteSpace(password)) {
        $("#pw-error").toggleClass("invisible")
    }
    else {
        console.log("Attempting to upload")
        return true
    }
}

const checkWhiteSpace = (string) => string.indexOf(' ') >= 0;

function matchUsername(name) {
    if (duplicateNames.includes(name.toUpperCase())) {
        console.log("Name is taken")
        return false
    } 
    else {
        console.log("Name is available")
        return true
    }
}


