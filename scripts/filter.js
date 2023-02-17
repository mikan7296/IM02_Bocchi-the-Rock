import { getProducts } from './firebase.js'

$(document).ready(function() {
    getProducts() //To get the product cards(from firebase.js)
    const filters = getFilters() //Get all the available filter tags from all the cards
    assignDropdownEvents()
    //To close filter sidebar if window is resized and sidebar is active(from the bg-dark)
    $(window).resize(function(e){
        if ($(window).width() > 786 && !$("#bg-dark").hasClass('hidden')) {
            toggleFilterSidebar()
        }
    });
    //Event to toggle mobile filter sidebar
    $(".mobile-filter-toggle").click(function(e){
        toggleFilterSidebar()
    })
    //Searchbar event for passing value into function
    $("#search").keyup(function(){
        let string = $("#search").val()
        getCards(string)
    })
    //Filter option event for passing data value into function
    $(".brand-filter-option").click(function(e){
        let brand = $(this).attr('data-filter-name')
        filter(brand,filters)
    })
    //Filter option event for passing data value into function
    $(".shape-filter-option").click(function(e){
        let shape = $(this).attr('data-filter-name')
        filter(shape,filters)
    })
});
//Filter dropdown events
function assignDropdownEvents() {
    $("#category-dropdown-brands").click(function (e){
        $("#category-dropdown-icon-brands").toggleClass("rotate-180")
        $("#category-container-brands").toggleClass("max-h-0 max-h-40")
    })

    $("#category-dropdown-shapes").click(function (e){
        $("#category-dropdown-icon-shapes").toggleClass("rotate-180")
        $("#category-container-shapes").toggleClass("max-h-0 max-h-40")
    })  
}
//To toggle filter sidebar on mobile
function toggleFilterSidebar() {
    $("#bg-dark").toggleClass('hidden')
    $('body').toggleClass('overflow-hidden')
    $("#filter-section").toggleClass('hidden flex z-50')
}
//Function to get all the filter tags in all the cards(brand and shape), returns an object with the tags as keys and values as false
function getFilters() {
    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    let allTags = []
    for (let i = 0;i<totalItemsLength;i++) {
        //Get tags, if repeated skip else add to array
        let brandTags = $(`#card_${i}`).attr(`data-brand`).toLowerCase()
        let shapeTags = $(`#card_${i}`).attr(`data-shape`).toLowerCase()
        if (!allTags.includes(brandTags)) {
            allTags.push(tag)
        }
        if (!allTags.includes(shapeTags)) {
            allTags.push(tag)
        }
    }
    //Set false values for all the tags and return
    let filters = {}
    for (let k in allTags) {
        let v = allTags[k] 
        filters[`${v}`] = false
    }
    return filters
}
//To filter object by tags // same as my ASG1
function filter(name,filters) {
    //If true set false else true etc
    if (filters[name]) {
        filters[name] = false
    } else {
        filters[name] = true
    }
    let toShow = []
    let toHide = []
    //For all the tags, if true add to toShow else toHide
    for (let k in filters) {
        let v = filters[k]
        if (v) {
            toShow.push(k.toLowerCase())
        } else {
            toHide.push(k.toLowerCase())
        }
    }

    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    //For every product card, get filter tags and match against toShow
    for (let i = 0;i<totalItemsLength;i++) {
        let brandtag = $(`#card_${i}`).attr(`data-brand`).toLowerCase()
        let shapetag = $(`#card_${i}`).attr(`data-shape`).toLowerCase()
        let show = false
        //For brand & shape 
        if (($('.brand-filter-option').is(':checked')) && ($('.shape-filter-option').is(':checked'))) {
            if (toShow.includes(brandtag) && (toShow.includes(shapetag))) {
                show = true
            }
        } else {
            //For brand only
            if ($('.brand-filter-option').is(':checked')) {
                if (toShow.includes(brandtag)) {
                    show = true
                }
            //For shape only
            } else if ($('.shape-filter-option').is(':checked')) {
                if (toShow.includes(shapetag)) {
                    show = true
                }
            }
        }
        //If any of the condition sets show to true, show the card
        if (show) {
            $(`#card_${i}`).removeClass("invisible")
            $(`#card_${i}`).css("order",0)
        //else set it to invisible and send it to the back(to maintain grid layout if 0 items matches the filter combinition, can't use hide() or hidden class in this case)
        } else {
            $(`#card_${i}`).addClass("invisible")
            $(`#card_${i}`).css("order",1)
        }
    }
    //If all filter options are deselected
    if (toShow.length == 0) {
        showAll()
    }
}
//To show all the cards 
function showAll() {
    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    for (let i = 0;i<totalItemsLength;i++) {
        $(`#card_${i}`).removeClass("invisible")
        $(`#card_${i}`).css("order",0)
    }
}
//To search cards by their name, accepts a string
function getCards (string) {
    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    //For every card, check product name includes string argument
    for (let i = 0;i<totalItemsLength;i++) {
        //Show if includes, else hide
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
