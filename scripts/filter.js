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
