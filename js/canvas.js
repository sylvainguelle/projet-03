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
		//ecouteurs d'evenements
		this.canvas.addEventListener("mousemove",this.trackMouse.bind(this));
		this.canvas.addEventListener("touchmove",this.trackTouch.bind(this));
		this.canvas.addEventListener("mousedown",this.startDrawingMouse.bind(this));
		this.canvas.addEventListener("touchstart",this.startDrawingTouch.bind(this));
		this.canvas.addEventListener("mouseup",this.stopDrawingMouse.bind(this));
		this.canvas.addEventListener("touchend",this.stopDrawingTouch.bind(this));
		this.canvasButton.addEventListener("click",this.validateCanvas.bind(this));
	}
	//fonction dessin
	drawLine() {
		if (this.drawing === true) {
			this.signatureOk = true;
			this.ctx.moveTo(this.lastPos.x,this.lastPos.y);
			this.ctx.lineTo(this.mousePos.x,this.mousePos.y);
			this.ctx.stroke();
		};
	};
	//fonction tracking souris
	trackMouse(e) {
		//nouvelle position
		this.mousePos.x = e.clientX - this.canvas.getBoundingClientRect().left;
		this.mousePos.y = e.clientY - this.canvas.getBoundingClientRect().top;
		console.log(this.mousePos.x+" "+this.mousePos.y);
		//lancer le dessin
		this.drawLine();
		//derniere position
		this.lastPos.x = e.clientX - this.canvas.getBoundingClientRect().left;
		this.lastPos.y = e.clientY  - this.canvas.getBoundingClientRect().top;
		console.log(this.lastPos.x+" "+this.lastPos.y);
	};
	//fonction tracking tactile
	trackTouch(e) {
		this.mousePos.x = e.touches[0].clientX - this.canvas.getBoundingClientRect().left;
		this.mousePos.y = e.touches[0].clientY - this.canvas.getBoundingClientRect().top;
		this.drawLine();
		this.lastPos.x = e.touches[0].clientX - this.canvas.getBoundingClientRect().left;
		this.lastPos.y = e.touches[0].clientY - this.canvas.getBoundingClientRect().top;
		e.preventDefault();
	};
	//fonction demarrer dessin souris
	startDrawingMouse() {
		this.drawing = true;
		console.log(this.drawing);
	};
	//fonction demarrer dessin tactile
	startDrawingTouch(e) {
		this.lastPos.x = e.touches[0].clientX - this.canvas.getBoundingClientRect().left;
		this.lastPos.y = e.touches[0].clientY - this.canvas.getBoundingClientRect().top;
		this.drawing = true;
		e.preventDefault();
	};
	//stopper dessin souris
	stopDrawingMouse() {
		this.drawing = false;
		console.log(this.drawing);
	};
	//stopper dessin tactile
	stopDrawingTouch(e) {
		this.drawing = false;
		e.preventDefault();
	};
	//validation du canvas
	validateCanvas() {
		if (this.signatureOk === false) {
			alert("Veuillez signer dans le champ de signature");
		} else {
			document.getElementById(this.divInsertCanvas).removeChild(this.divCanvas);
			//obtenir heure de fin de reservation et la stocker avec sessionstorage
      const dateEndReservation = new Date().getTime()+20*60*1000;
			//stocker données de reservation avec sessionstorage
      sessionStorage.setItem("heureFinReservation",dateEndReservation);
			sessionStorage.setItem("stationReserve",document.getElementById("nomStation").innerText);
			sessionStorage.setItem("adresseReserve",document.getElementById("adresseStation").innerText);
    	mapLyon.addReservation();
		};
	};
};

function canvas() {
	const canvasSignature = new Canvas("formulaire-inscription");
};
