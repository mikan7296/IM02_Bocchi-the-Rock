import { popup } from './popup.js';
import { getDuplicateUsernames, addUserData, login } from './firebase.js'


$(document).ready(function () {
    getDuplicateUsernames()
    $("#eye1, #eye2").click(function (e){
        togglePassword()
    })
   
    $("#submitbtn").click(function (e) {
        e.preventDefault();
        $("#submitbtn").attr("disabled", true);
        const name = $("#name-input").val();
        const password = $("#pw-input").val();
        setTimeout(function(){
            $("#submitbtn").attr("disabled", false);
        },1000)
        if (validateInputs(name,password)) {
            if (matchUsername(name)) {
                addUserData(name,password)
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
        $("#name-input").toggleClass("border-red-700","border-gray-400")

    }
    else if (checkWhiteSpace(password)) {
        $("#pw-error").toggleClass("invisible")
        $("#pw-input").toggleClass("border-red-700","border-gray-400")
    }
    else {
        console.log("Attempting to upload")
        return true
    }
}

const checkWhiteSpace = (string) => string.indexOf(' ') >= 0;

function matchUsername(name) {
    let duplicateNames = []
    if (localStorage.existingUsernames) {
        duplicateNames = localStorage.existingUsernames.split(',')
    }
    if (duplicateNames.includes(window.btoa(name.toUpperCase()))) {
        popup("Error!",`The username ${name} is taken!`)
        return false
    } 
    else {
        return true
    }
}


