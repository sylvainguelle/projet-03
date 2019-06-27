class Canvas {
	constructor(divIdCanvas) {
		//creation et definition du canvas
		this.divInsertCanvas = divIdCanvas;
		this.divCanvas = document.createElement("div")
		this.divCanvas.id = "div-canvas"
		this.canvas = document.createElement("canvas");
		this.canvas.height = 200;
		this.canvas.width = 300;
		this.canvas.style.border = "1px solid black";
		this.canvas.style.backgroundColor = "white";
		//definition contexte 2d canvas
		this.ctx = this.canvas.getContext("2d");
		this.signatureOk = false;
		//insertion du canvas sur la page et du bouton validation canvas
		this.divCanvas.appendChild(this.canvas);
		this.canvasButton = document.createElement("button");
		this.canvasButton.id = "canvas-button";
		this.canvasButton.classList.add("btn","btn-success");
		this.canvasButton.textContent = "Valider la signature";
	  this.divCanvas.appendChild(document.createElement("br"));
	  this.divCanvas.appendChild(this.canvasButton);
		document.getElementById(this.divInsertCanvas).appendChild(this.divCanvas);

		//variable de tracking de position
		this.mousePos = {x:0,y:0};
		this.lastPos = {x:0,y:0};
		//variable état si dessin en cours
		this.drawing = false;
	}
	drawLine() {
		if (this.drawing === true) {
			this.signatureOk = true;
			this.ctx.moveTo(this.lastPos.x,this.lastPos.y);
			this.ctx.lineTo(this.mousePos.x,this.mousePos.y);
			this.ctx.stroke();
		};
	};
};

function canvas() {

	const canvasSignature = new Canvas("formulaire-inscription");

	//evenement au mouvement de la souris pour avoir la position du curseur
	canvasSignature.canvas.addEventListener("mousemove", function(e) {
		//nouvelle position
		canvasSignature.mousePos.x = e.clientX - canvasSignature.canvas.getBoundingClientRect().left;
		canvasSignature.mousePos.y = e.clientY - canvasSignature.canvas.getBoundingClientRect().top;
		//lancer le dessin
		canvasSignature.drawLine();
		//derniere position
		canvasSignature.lastPos.x = e.clientX - canvasSignature.canvas.getBoundingClientRect().left;
		canvasSignature.lastPos.y = e.clientY  - canvasSignature.canvas.getBoundingClientRect().top;
	});

	//evenement tactile au mouvement pour avoir la position du doigt
	canvasSignature.canvas.addEventListener("touchmove",function(e) {
		canvasSignature.mousePos.x = e.touches[0].clientX - canvasSignature.canvas.getBoundingClientRect().left;
		canvasSignature.mousePos.y = e.touches[0].clientY - canvasSignature.canvas.getBoundingClientRect().top;
		canvasSignature.drawLine();
		canvasSignature.lastPos.x = e.touches[0].clientX - canvasSignature.canvas.getBoundingClientRect().left;
		canvasSignature.lastPos.y = e.touches[0].clientY - canvasSignature.canvas.getBoundingClientRect().top;
		e.preventDefault();
	});

	canvasSignature.canvas.addEventListener("mousedown", function() {
		canvasSignature.drawing = true;
	});

	canvasSignature.canvas.addEventListener("touchstart", function(e) {
		canvasSignature.lastPos.x = e.touches[0].clientX - canvasSignature.canvas.getBoundingClientRect().left;
		canvasSignature.lastPos.y = e.touches[0].clientY - canvasSignature.canvas.getBoundingClientRect().top;
		canvasSignature.drawing = true;
		e.preventDefault();
	});

	canvasSignature.canvas.addEventListener("mouseup", function() {
		canvasSignature.drawing = false;
	});

	canvasSignature.canvas.addEventListener("touchend", function(e) {
		canvasSignature.drawing = false;
		e.preventDefault();
	});

	//validation de la signature au clic
	canvasSignature.canvasButton.addEventListener("click", function () {
		if (canvasSignature.signatureOk === false) {
			alert("Veuillez signer dans le champ de signature");
		} else {
			document.getElementById(canvasSignature.divInsertCanvas).removeChild(canvasSignature.divCanvas);
			//obtenir heure de fin de reservation et la stocker avec sessionstorage
      const dateEndReservation = new Date().getTime()+20*60*1000;
			//stocker données de reservation avec sessionstorage
      sessionStorage.setItem("heureFinReservation",dateEndReservation);
			sessionStorage.setItem("stationReserve",document.getElementById("nomStation").innerText);
			sessionStorage.setItem("adresseReserve",document.getElementById("adresseStation").innerText);
    	mapLyon.addReservation();
		};
	});
};
