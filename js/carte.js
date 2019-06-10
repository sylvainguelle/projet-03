//declaration variable
const mymap = L.map('carte').setView([45.760033,4.838189],15);//inialisation carte avec centre et zoom
const calqueMarqueur = L.layerGroup().addTo(mymap); // creation calque pour affichage des marqueurs
const url = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=3c65f322235f7ce3680b5ba51ce05b8811041058";
let stations = [];// inialisation tableau objet des stations
//element dom à mettre à jour
const nameStationElt = document.getElementById('nomStation');
const addressStationElt = document.getElementById('adresseStation');
const avBikesStationElt = document.getElementById('nbVeloDispoStation');
const avStandsStationElt = document.getElementById('nbEmplacementStation');
const inscriptionButton = document.getElementById('bouton-incription');
const reservationElt = document.getElementById('reservation');
//option de la carte mapbox
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic3lsdmFpbmd1ZWxsZSIsImEiOiJjandodnUwbzEwZGx3NDJtano3ZHY3MHlhIn0.zglA2Ncbo2bLKAnY55hK7g'
}).addTo(mymap);

//function requete vers api JCDecaux et maj tableau stations
function appelJCDecaux() {
  ajaxGet(url, function (reponse) { //
      let reponseElt = JSON.parse(reponse);
      for (const item of reponseElt) {
        const marqueursInfos = {
          name: item.name,
          address: item.address,
          bike: item.available_bikes,
          stand: item.bike_stands,
          lat: item.position.lat,
          lng: item.position.lng,
        };
        stations.push(marqueursInfos);
      };
      updateMap();
  });
};

//fonction ajout marqueur sur la carte
function updateMap() {
  calqueMarqueur.clearLayers();//effacer marqueurs
  for (let i = 0; i < stations.length; i++) {
    const marqueur = L.marker([stations[i].lat,stations[i].lng]);
    marqueur.options.station = stations[i];
    marqueur.on('click', function (e){
      const currentMarker = e.target;
      nameStationElt.textContent = currentMarker.options.station.name;
      addressStationElt.textContent = currentMarker.options.station.address;
      avBikesStationElt.textContent = currentMarker.options.station.bike;
      avStandsStationElt.textContent = currentMarker.options.station.stand;
    });
    //verification position station par rapport limite de la carte affiché
    if ((stations[i].lat<mymap.getBounds()._northEast.lat)&&
    (stations[i].lat>mymap.getBounds()._southWest.lat)&&
    (stations[i].lng<mymap.getBounds()._northEast.lng)&&
    (stations[i].lng>mymap.getBounds()._southWest.lng)) {
      //generer marqueur
      marqueur.addTo(calqueMarqueur);
    };
  };
};

//fonction formulaire inscription
function AddInscriptionForm() {
  if((!document.getElementById('form-button')) && (!document.querySelector('canvas'))){
    const formBr = document.createElement('br');
    const formNom = document.createElement('input');
    formNom.type = "text";
    formNom.name = "nom";
    formNom.defaultValue = "Nom";
    formNom.required = true;
    const formPrenom = document.createElement('input');
    formPrenom.type = "text";
    formPrenom.name = "prenom";
    formPrenom.defaultValue = "Prénom";
    formPrenom.required = true;
    const formButton = document.createElement('button');
    formButton.textContent = "Valider la réservation";
    formButton.classList.add("btn","btn-success");
    formButton.id = 'form-button';
    const form = document.createElement('form');
    form.appendChild(formNom);
    form.appendChild(formPrenom);
    form.appendChild(formBr);
    form.appendChild(formButton);
    document.getElementById('formulaire-inscription').appendChild(form);
    //evenement validation formulaire
    formButton.addEventListener('click', function (e){
      //stocker données formulaire api web storage
      console.log(form[0].value);
      console.log(form[1].value);
      //fermer formulaire
      document.getElementById('formulaire-inscription').removeChild(form);
      //ouvrir canvas signature
      canvas();
      e.preventDefault();
    });
  };
};

//fonction canvas de signature
function canvas() {
	const canvas = document.createElement("canvas");
	canvas.height = 200;
	canvas.width = 400;
	canvas.style.border = "1px solid black";
	canvas.style.backgroundColor = "white";
	const ctx = canvas.getContext("2d");
	document.getElementById("formulaire-inscription").appendChild(canvas);
	//bouton validation canvas
	const canvasButton = document.createElement('button');
	canvasButton.classList.add("btn","btn-success");
	canvasButton.textContent = "Valider la signature";
	document.getElementById("formulaire-inscription").appendChild(canvasButton);

	canvasButton.addEventListener('click', function () {
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

	//obtenir la position de la souris par rapport au canvas
	function getMousePos (canvasDom, mouseEvent) {
		const rect = canvasDom.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left ,
			y: mouseEvent.clientY - rect.top
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

function addReservation() {
  document.getElementById("reservation").textContent =
  "Vous avez réservez un velo à la station "+
  document.getElementById('nomStation').innerText+", "+
  document.getElementById('adresseStation').innerText;
  timerReservation();
  document.getElementById('bouton-inscription-info').textContent = "la réservation d'un nouveau velo annulera la réservation en cours";
};

function timerReservation() {
  let time = 20*60*1000;
  function timer() {
    time = (time-1000);
    const minute = Math.floor(time / 60000);
    const second = ((time%60000)/1000).toFixed(0);
    //console.log(minute+":"+(second<10 ?'0':'')+second);
    document.getElementById('timer').textContent = "réservation valide pendant : "
    +minute+" minute(s) "+(second<10 ?'0':'')+second+" seconde(s) ";
    if (time<0) {
      clearInterval(interval);
      document.getElementById('timer').textContent = "";
      document.getElementById("reservation").textContent = "Pas de réservation en cours";
      document.getElementById('bouton-inscription-info').textContent = "";

    };
  };
    inscriptionButton.addEventListener('click',function(){
      clearInterval(interval);
      document.getElementById('timer').textContent = "";
      document.getElementById("reservation").textContent = "Pas de réservation en cours";
      document.getElementById('bouton-inscription-info').textContent = "";
    });
  const interval = setInterval(timer, 1000);
};


//lancement de la fonction d'appel
appelJCDecaux();

//evenement MAJ coordonnées et marqueurs à la fin d'un deplacement de la carte
mymap.on('moveend',function (){
  updateMap();
});

//evenement clic sur le bouton d'incription
inscriptionButton.addEventListener('click',function(){
  //verifier qu'une station est bien selectionnée
  if (nameStationElt.textContent.length>0) {
    //verifier si velo dispo >0
    if (Number(avBikesStationElt.textContent)>0) {
      //afficher formulaire
      AddInscriptionForm();
    }
    else {
      document.getElementById('bouton-inscription-info').textContent = 'pas de velo disponible';
      setTimeout(function() {
        document.getElementById('bouton-inscription-info').textContent = '';
      },5000);
    }
  }
  else {
    document.getElementById('bouton-inscription-info').textContent = 'pas de station selectionnée';
    setTimeout(function() {
      document.getElementById('bouton-inscription-info').textContent = '';
    },5000);
  }
});
