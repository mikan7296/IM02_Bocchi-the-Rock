import { getPurchaseHistory, getUserVouchers, getVouchers, updateUserData } from './firebase.js'
import { popup } from './popup.js';
$(document).ready(function () {
    getPurchaseHistory() // Get user's purchase history
    getVouchers() // Get all vouchers for redemption
    getUserVouchers()// Get all of user's vouchers

    //To update account details with some validations(empty spaces)
    $("#my-profile-container-submit").click(function(e){
        e.preventDefault()
        let name = $("#my-profile-container-username").val()
        let password = $("#my-profile-container-password").val()
        if (name == "" && password == "") {
            popup("Error - Empty Fields","Please do not leave the fields empty",true)
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

    //For toggling between the profile sections on PC
    $("#profile-my-account, #profile-my-purchases, #profile-my-vouchers").click(function(e){
        let val = $(this).attr('data-category')
        if (val == 'account') {
            $("#my-purchases-container, #my-vouchers-container").removeClass('flex').addClass('md:hidden')
            $("#my-account-container").removeClass('md:hidden').addClass('flex')
        } else if (val == 'purchase') {
            $("#my-account-container, #my-vouchers-container").removeClass('flex').addClass('md:hidden')
            $("#my-purchases-container").removeClass('md:hidden').addClass('flex')
        } else if (val =='voucher') {
            $("#my-account-container, #my-purchases-container").removeClass('flex').addClass('md:hidden')
            $("#my-vouchers-container").removeClass('md:hidden').addClass('flex')
        }
    })
});

  