import { popup } from './popup.js';
import { matchPassword} from './firebase.js'


$(document).ready(function () {
    $("#eye1, #eye2").click(function (e){
        togglePassword()
    })
    
    $("#submitbtn").click(function (e) {
        e.preventDefault();
        const name = $("#name-input").val();
        const password = $("#pw-input").val();
        if (matchPassword(name,password) == false) {
            setTimeout(function(){
                popup("Login Failed","Incorrect Credentials")
            },1000)
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



