import { checkDuplicateUsernames } from './firebase.js'
import { popup } from './popup.js';

$(document).ready(function () {
   assignEvents()
});

function assignEvents() {
    //Events for toggling password visibility
    $("#eye1, #eye2").click(function (e){
        togglePassword()
    })
   
    $("#submitbtn").click(function (e) {
        //Prevent default, assigning values to variables and disabling submit button for 1 sec after pressing
        e.preventDefault();
        $("#submitbtn").attr("disabled", true);
        const name = $("#name-input").val();
        const password = $("#pw-input").val();
        setTimeout(function(){
            $("#submitbtn").attr("disabled", false);
        },1000)
        //If no errors access the database
        if (validateInputs(name,password)) {
           checkDuplicateUsernames(name,password)
        }
    });

}
//Function for toggling password visiblity
function togglePassword() {
    if ($("#pw-input").attr("type") == "password") {
        $("#pw-input").attr("type","text")
    } else {$("#pw-input").attr("type","password")}

    $("#eye2").toggleClass("hidden")
    $("#eye1").toggleClass("hidden")
}
//To check inputs for errors, returns true if successful else false
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
        return true
    }
}
//For checking whitespaces in strings
const checkWhiteSpace = (string) => string.indexOf(' ') >= 0;


