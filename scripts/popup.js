export function popup(title,message) {

    const template = `
    <div id="messageContainer" class="transition-all backdrop-brightness-75 w-full h-full flex justify-center items-center z-50 absolute top-0 left-0">
		<div class="bg-white w-5/6 max-w-xl h-auto text-center rounded-3xl">
			<div class="h-4/5 p-4">
				<h3 id="messageTitle" class="text-3xl">${title}</h3>
				<p id="messageText" class="leading-6 pt-2">${message}</p>
			</div>
			<div class="h-1/5 pb-4">
				<button id="messageClose" class="p-2 bg-blue-300 px-16 text-xl rounded-full">Close</button>
			</div>
		</div>
	</div>`


    $("body").append(template)

    $("#messageClose").click(function () {
        $("#messageContainer").remove()
    })
}
