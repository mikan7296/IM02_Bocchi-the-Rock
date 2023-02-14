import { getPurchaseHistory, getUserVouchers, getVouchers, updateUserData } from './firebase.js'
import { popup } from './popup.js';
$(document).ready(function () {
    getPurchaseHistory()
    getVouchers()
    getUserVouchers()

    $("#my-profile-container-submit").click(function(e){
        e.preventDefault()
        let name = $("#my-profile-container-username").val()
        let password = $("#my-profile-container-password").val()
        if (name == "" && password == "") {
            popup("Error - Empty Fields","Please do not leave the fields empty")
        } else if (name == "" && !(password == "")){
            updateUserData('pw',name,password)
            popup("Success","Details successfully changed")
        } else if (password == "" && !(name == "")) {
            updateUserData('name',name,password)
            popup("Success","Details successfully changed")
        } else {
            updateUserData('both',name,password)
            popup("Success","Details successfully changed")
        }
    })

});

  