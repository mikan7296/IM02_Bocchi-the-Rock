
$(document).ready(function () {
    for (var i=0;i<20;i++) {

        let card = 
            `<div id="card" class="container px-2 h-fit">
                <div class="m-2 mt-8 p-2 h-72 bg-orange-300 rounded-lg shadow-xl">
                    <img class="w-full h-3/5 object-fill" src="../media/burger.jfif">
                    <div class="h-2/5 grid grid-rows-2">
                        <h1 class="text-lg font-semibold truncate">NAMENAMENAMENAMENAMENAMENAMENAME</h1>
                        <h3>$123.45</h3>
                    </div>
                </div>
            </div>`


        console.log(`${i}`)
        container = $("#card-container")
        container.append(card)
    }


















    
});

