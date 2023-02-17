import { matchPassword } from './firebase.js'

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
        
        matchPassword(name,password)
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



