$(document).ready(function () {
    for (var i=0;i<50;i++) {

        let card = 
            `<div id="card_${i}" class="container px-2 h-fit">
                <div class="m-2 mt-8 p-2 h-72 bg-orange-300 rounded-lg shadow-xl">
                    <img class="w-full h-3/5 object-fill" src="../media/burger.jfif">
                    <div class="h-2/5 grid grid-rows-2">
                        <h1 id="name_${i}" class="text-lg font-semibold truncate">NAME_${i}</h1>
                        <h3 id="price_${i}" >$123.45</h3>
                    </div>
                </div>
            </div>`

        container = $("#card-container")
        container.append(card)
    }
});

