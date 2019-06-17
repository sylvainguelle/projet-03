//fonction canvas de signature
function canvas() {
	const canvas = document.createElement("canvas");
	canvas.height = 150;
	canvas.width = 200;
	canvas.style.border = "1px solid black";
	canvas.style.backgroundColor = "white";
	const ctx = canvas.getContext("2d");
	document.getElementById("formulaire-inscription").appendChild(canvas);
	//bouton validation canvas
	const canvasButton = document.createElement('button');
	canvasButton.classList.add("btn","btn-success");
	canvasButton.textContent = "Valider la signature";
  document.getElementById("formulaire-inscription").appendChild(document.createElement("br"));
  document.getElementById("formulaire-inscription").appendChild(canvasButton);

	canvasButton.addEventListener("click", function () {
		document.getElementById("formulaire-inscription").removeChild(canvas);
		document.getElementById("formulaire-inscription").removeChild(canvasButton);
    addReservation();
	});

	//evenement souris
	let drawing = false;
	let mousePos = {x:0,y:0};
	let lastPos = mousePos;
	canvas.addEventListener("mousedown", function (e) {
		drawing = true;
		lastPos = getMousePos(canvas, e);
	},false);
	canvas.addEventListener("mouseup", function (e) {
		drawing = false;
	},false);
	canvas.addEventListener("mousemove", function (e) {
		mousePos = getMousePos(canvas, e);
	},false);

  //evenement touch pour tactile
  canvas.addEventListener("touchstart", function (e) {
		drawing = true;
		lastPos = getTouchPos(canvas, e);
	},false);
	canvas.addEventListener("touchend", function (e) {
		drawing = false;
	},false);
	canvas.addEventListener("touchmove", function (e) {
		mousePos = getTouchPos(canvas, e);
	},false);

	//obtenir la position de la souris par rapport au canvas
	function getMousePos (canvasDom, mouseEvent) {
		const rect = canvasDom.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left ,
			y: mouseEvent.clientY - rect.top
		};
	};

  //obtenir la position de la souris par rapport au canvas
	function getTouchPos (canvasDom, touchEvent) {
		const rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.clientX - rect.left ,
			y: touchEvent.clientY - rect.top
		};
	};

	// Get a regular interval for drawing to the screen
	window.requestAnimFrame = (function (callback) {
	        return window.requestAnimationFrame ||
	           window.webkitRequestAnimationFrame ||
	           window.mozRequestAnimationFrame ||
	           window.oRequestAnimationFrame ||
	           window.msRequestAnimaitonFrame ||
	           function (callback) {
	        window.setTimeout(callback, 1000/60);
	           };
	})();

	// Draw to the canvas
	function renderCanvas() {
	  if (drawing) {
	    ctx.moveTo(lastPos.x, lastPos.y);
	    ctx.lineTo(mousePos.x, mousePos.y);
	    ctx.stroke();
	    lastPos = mousePos;
	  }
	}

	// Allow for animation
	(function drawLoop () {
	  requestAnimFrame(drawLoop);
	  renderCanvas();
	})();
};
