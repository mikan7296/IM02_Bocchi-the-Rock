$(document).ready(function() {
    $("#category-dropdown").click(function (e){
        $("#category-dropdown-icon_down").toggleClass("rotate-90")
        $("#category-container").toggleClass("scale-0")
    })

    $("#search").keyup(function(){
        let string = $("#search").val()
        getCards(string)
    })

});

function getCards (string) {
    let container = $("#card-container")
    let totalItemsLength =  container.find("h1").length
    let displayedItems = 0
    for (let i = 0;i<totalItemsLength;i++) {
        if ($(`#name_${i}`).text().includes(string)) {
            $(`#card_${i}`).removeClass("invisible")
            $(`#card_${i}`).css("order",0)
        } else {
            $(`#card_${i}`).addClass("invisible")
            $(`#card_${i}`).css("order",1)
        }
    }
    container.animate({scrollTop:0},300)
   
}
