import { getPurchaseHistory, getUserVouchers, getVouchers } from './firebase.js'

$(document).ready(function () {
    getPurchaseHistory()
    getVouchers()
    getUserVouchers()
});

  