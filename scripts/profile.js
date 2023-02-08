import { getPurchaseHistory, getVouchers } from './firebase.js'

$(document).ready(function () {
    getPurchaseHistory()
    getVouchers()
});

  