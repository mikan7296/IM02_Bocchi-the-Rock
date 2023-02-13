import { getProducts } from './firebase.js'

$(document).ready(function() {
    getProducts()
    const filters = getFilters()
    $("#category-dropdown-brands").click(function (e){
        $("#category-dropdown-icon-brands").toggleClass("rotate-180")
        $("#category-container-brands").toggleClass("max-h-0 max-h-40")
    })

    $("#category-dropdown-shapes").click(function (e){
        $("#category-dropdown-icon-shapes").toggleClass("rotate-180")
        $("#category-container-shapes").toggleClass("max-h-0 max-h-40")
    })  

    $(window).on('resize', function(){
        let width = $(this).width();
        if (width > 786 && !$("#bg-dark").hasClass('hidden')) {
            toggleFilterSidebar()
        }
    });

    $(".mobile-filter-toggle").click(function(e){
        toggleFilterSidebar()
    })

    $("#search").keyup(function(){
        let string = $("#search").val()
        getCards(string)
    })

    $(".brand-filter-option").click(function(e){
        let brand = $(this).attr('data-filter-name')
        filter(brand,filters)
    })

    $(".shape-filter-option").click(function(e){
        let shape = $(this).attr('data-filter-name')
        filter(shape,filters)
    })
});

function toggleFilterSidebar() {
    $("#bg-dark").toggleClass('hidden')
    $('body').toggleClass('overflow-hidden')
    $("#filter-section").toggleClass('hidden flex z-50')
}

function getFilters() {
    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    let allTags = []
    for (let i = 0;i<totalItemsLength;i++) {
        let brandTags = $(`#card_${i}`).attr(`data-brand`).toLowerCase()
        let shapeTags = $(`#card_${i}`).attr(`data-shape`).toLowerCase()
        if (!allTags.includes(brandTags)) {
            allTags.push(tag)
        }
        if (!allTags.includes(shapeTags)) {
            allTags.push(tag)
        }
    }
    let filters = {}
    for (let k in allTags) {
        let v = allTags[k] 
        filters[`${v}`] = false
    }
    return filters
}

function filter(name,filters) {

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
            toShow.push(k.toLowerCase())
            console.log(toShow)
        } else {
            toHide.push(k.toLowerCase())
        }
    }

    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    for (let i = 0;i<totalItemsLength;i++) {
            
        let brandtag = $(`#card_${i}`).attr(`data-brand`).toLowerCase()
        let shapetag = $(`#card_${i}`).attr(`data-shape`).toLowerCase()
        let show = false

        if (($('.brand-filter-option').is(':checked')) && ($('.shape-filter-option').is(':checked'))) {
            if (toShow.includes(brandtag) && (toShow.includes(shapetag))) {
                show = true
            }
        } else {
            if ($('.brand-filter-option').is(':checked')) {
                if (toShow.includes(brandtag)) {
                    show = true
                }
            } else if ($('.shape-filter-option').is(':checked')) {
                if (toShow.includes(shapetag)) {
                    show = true
                }
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
