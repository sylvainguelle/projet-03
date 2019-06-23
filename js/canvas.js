function canvas() {
	//creation et definition du canvas
	const canvas = document.createElement("canvas");
	canvas.height = 200;
	canvas.width = 300;
	canvas.style.border = "1px solid black";
	canvas.style.backgroundColor = "white";
	//definition contexte 2d canvas
	const ctx = canvas.getContext("2d");
	//insertion du canvas sur la page et du bouton validation canvas
	document.getElementById("formulaire-inscription").appendChild(canvas);
	const canvasButton = document.createElement('button');
	canvasButton.classList.add("btn","btn-success");
	canvasButton.textContent = "Valider la signature";
  document.getElementById("formulaire-inscription").appendChild(document.createElement("br"));
  document.getElementById("formulaire-inscription").appendChild(canvasButton);

	//validation de la signature au clic
	canvasButton.addEventListener("click", function () {
		document.getElementById("formulaire-inscription").removeChild(canvas);
		document.getElementById("formulaire-inscription").removeChild(canvasButton);
    addReservation();
	});

	//variable de tracking de position
	let mousePos = {x:0,y:0};
	let lastPos = {x:0,y:0};
	//variable état si dessin en cours
	let drawing = false;

	//evenement au mouvement de la souris pour avoir la position du curseur
	canvas.addEventListener("mousemove", function(e) {
		//nouvelle position
		mousePos.x = e.clientX - canvas.getBoundingClientRect().left;
		mousePos.y = e.clientY - canvas.getBoundingClientRect().top;
		//lancer le dessin
		drawLine();
		//derniere position
		lastPos.x = e.clientX - canvas.getBoundingClientRect().left;
		lastPos.y = e.clientY  - canvas.getBoundingClientRect().top;
	});

	//evenement tactile au mouvement pour avoir la position du doigt
	canvas.addEventListener("touchmove",function(e) {
		mousePos.x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
		mousePos.y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
		drawLine();
		lastPos.x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
		lastPos.y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
		e.preventDefault;
	});
	
	canvas.addEventListener("mousedown", function() {
		drawing = true;
	});

	canvas.addEventListener("touchstart", function(e) {
		lastPos.x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
		lastPos.y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
		drawing = true;
		e.preventDefault;
	});

	canvas.addEventListener("mouseup", function() {
		drawing = false;
	});

	canvas.addEventListener("touchend", function(e) {
		drawing = false;
		e.preventDefault;
	});

	function drawLine() {
		if (drawing===true) {
			ctx.moveTo(lastPos.x,lastPos.y);
			ctx.lineTo(mousePos.x,mousePos.y);
			ctx.stroke();
		};
	};
};
