function canvas() {
	//creation et definition du canvas
	const divCanvas = document.createElement("div")
	divCanvas.id = "div-canvas"
	const canvas = document.createElement("canvas");
	canvas.height = 200;
	canvas.width = 300;
	canvas.style.border = "1px solid black";
	canvas.style.backgroundColor = "white";
	//definition contexte 2d canvas
	const ctx = canvas.getContext("2d");
	let signatureOk = false;
	//insertion du canvas sur la page et du bouton validation canvas
	divCanvas.appendChild(canvas);
	const canvasButton = document.createElement('button');
	canvasButton.id = "canvas-button";
	canvasButton.classList.add("btn","btn-success");
	canvasButton.textContent = "Valider la signature";
  divCanvas.appendChild(document.createElement("br"));
  divCanvas.appendChild(canvasButton);
	document.getElementById("formulaire-inscription").appendChild(divCanvas);


	//validation de la signature au clic
	canvasButton.addEventListener("click", function () {
		if (signatureOk===false) {
			alert("Veuillez signer dans le champ de signature");
		} else {
			document.getElementById("formulaire-inscription").removeChild(divCanvas);
			//obtenir heure de fin de reservation et la stocker avec sessionstorage
      const dateEndReservation = new Date().getTime()+20*60*1000;
      sessionStorage.setItem("heureFinReservation",dateEndReservation);
    	addReservation();
		};
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
		e.preventDefault();
	});

	canvas.addEventListener("mousedown", function() {
		drawing = true;
	});

	canvas.addEventListener("touchstart", function(e) {
		lastPos.x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
		lastPos.y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
		drawing = true;
		e.preventDefault();
	});

	canvas.addEventListener("mouseup", function() {
		drawing = false;
	});

	canvas.addEventListener("touchend", function(e) {
		drawing = false;
		e.preventDefault();
	});

	function drawLine() {
		if (drawing===true) {
			signatureOk = true;
			ctx.moveTo(lastPos.x,lastPos.y);
			ctx.lineTo(mousePos.x,mousePos.y);
			ctx.stroke();
		};
	};
};
