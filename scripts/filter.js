const filters = {
    "gibson" : false,
    "epiphone" : false,
    "yamaha" : false
}

$(document).ready(function() {
    $("#category-dropdown-brands").click(function (e){
        $("#category-dropdown-icon-brands").toggleClass("rotate-180")
        $("#category-container-brands").toggleClass("max-h-0 max-h-40")
    })

    $("#search").keyup(function(){
        let string = $("#search").val()
        getCards(string)
    })

    $(".brand-filter-option").click(function(e){
        let brand = $(this).attr('data-brand')
        filter(brand)
    })
});

function getCards (string) {
    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    for (let i = 0;i<totalItemsLength;i++) {
        if ($(`.forNameSearch_${i}`).text().toUpperCase().includes(string.toUpperCase())) {
            $(`#card_${i}`).removeClass("invisible")
            $(`#card_${i}`).css("order",0)
        } else {
            $(`#card_${i}`).addClass("invisible")
            $(`#card_${i}`).css("order",1)
        }
    }
    container.animate({scrollTop:0},300)
}

function filter(name) {
    if (filters[name]) {
        filters[name] = false
    } else {
        filters[name] = true
    }
    let toShow = []
    let toHide = []
    for (let k in filters) {
        let v = filters[k]
        if (v) {
            toShow.push(k)
        } else {
            toHide.push(k)
        }
    }

    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    for (let i = 0;i<totalItemsLength;i++) {
        let tags = $(`#card_${i}`).attr('data-tags').split(',')
        let show = false
        for (let k in tags) {
            let v = tags[k]
            if (toShow.includes(v)) {
                show = true
            }
        }
        if (show) {
            $(`#card_${i}`).removeClass("invisible")
            $(`#card_${i}`).css("order",0)
        } else {
            $(`#card_${i}`).addClass("invisible")
            $(`#card_${i}`).css("order",1)
        }
    }

    if (toShow.length == 0) {
        showAll()
    }
}

function showAll() {
    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    for (let i = 0;i<totalItemsLength;i++) {
        $(`#card_${i}`).removeClass("invisible")
        $(`#card_${i}`).css("order",0)
    }
}