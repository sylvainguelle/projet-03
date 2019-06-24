//declaration variable
const mymap = L.map("carte").setView([45.760033,4.838189],15);//inialisation carte avec centre et zoom
const calqueMarqueur = L.layerGroup().addTo(mymap); // creation calque pour affichage des marqueurs
const url = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=3c65f322235f7ce3680b5ba51ce05b8811041058";
let stations = [];// inialisation tableau des stations
let time = 0; //variable pour le timer de reservation
let reservationEnCours = false; //variable pour bloquer le changement de station quand une reservation est en cours
//element dom à mettre à jour
const nameStationElt = document.getElementById("nomStation");
const addressStationElt = document.getElementById("adresseStation");
const avBikesStationElt = document.getElementById("nbVeloDispoStation");
const avStandsStationElt = document.getElementById("nbEmplacementStation");
const inscriptionButton = document.getElementById("bouton-incription");
const reservationElt = document.getElementById("reservation");
const statutStationElt = document.getElementById("statutStation");
//option de la carte mapbox
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1Ijoic3lsdmFpbmd1ZWxsZSIsImEiOiJjandodnUwbzEwZGx3NDJtano3ZHY3MHlhIn0.zglA2Ncbo2bLKAnY55hK7g"
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
          status: item.status,
        };
        stations.push(marqueursInfos);
      };
      updateMap();
  });
};

//fonction ajout ou maj des marqueurs sur la carte
function updateMap() {
  calqueMarqueur.clearLayers();//effacer marqueurs
  for (let i = 0; i < stations.length; i++) {
    const marqueur = L.marker([stations[i].lat,stations[i].lng]);
    marqueur.options.station = stations[i];
    marqueur.on("click", function (e){
      if (reservationEnCours===false) {
        const currentMarker = e.target;
        nameStationElt.textContent = currentMarker.options.station.name;
        addressStationElt.textContent = currentMarker.options.station.address;
        avBikesStationElt.textContent = currentMarker.options.station.bike;
        avStandsStationElt.textContent = currentMarker.options.station.stand;
        statutStationElt.textContent = currentMarker.options.station.status;
      };
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
  inscriptionButton.style.display = "none";//masque le bouton de reservation
  //ajout du formulaire
  const formBr = document.createElement("br");
  const formNom = document.createElement("input");
  formNom.type = "text";
  formNom.required = true;
  formNom.id = "nom-formulaire";
  const labelNom = document.createElement("label");
  labelNom.htmlFor = "nom-formulaire";
  labelNom.textContent = "Nom:";
  const formPrenom = document.createElement("input");
  formPrenom.type = "text";
  formPrenom.id = "prenom-formulaire";
  formPrenom.required = true;
  const labelPrenom = document.createElement("label");
  labelPrenom.htmlFor = "prenom-formulaire";
  labelPrenom.textContent = "Prénom:";
  //verifier si nom prenom sont stocké
  if (localStorage.getItem("nom")==null) {
    formNom.defaultValue = "";
  } else {
    formNom.defaultValue = localStorage.getItem("nom");
  };
  if (localStorage.getItem("prenom")==null) {
    formPrenom.defaultValue = "";
  } else {
    formPrenom.defaultValue = localStorage.getItem("prenom");
  };
  const formButton = document.createElement("button");
  formButton.textContent = "Valider la réservation";
  formButton.classList.add("btn","btn-success");
  formButton.id = "form-button";
  const form = document.createElement("form");
  form.appendChild(labelNom);
  form.appendChild(formNom);
  form.appendChild(labelPrenom);
  form.appendChild(formPrenom);
  form.appendChild(formBr);
  form.appendChild(formButton);
  document.getElementById("formulaire-inscription").appendChild(form);
  //evenement validation formulaire
  formButton.addEventListener("click", function (e){
    const champA = formNom.value;
    const champB = formPrenom.value;
    if (formNom.value.length===0||formPrenom.value.length===0) {
      alert("Veuillez remplir le nom et le prénom")
    } else {
      //stocker données formulaire avec local storage
      localStorage.setItem("nom",form[0].value) ;
      localStorage.setItem("prenom",form[1].value);
      //stocker données de reservation avec sessionstorage
      sessionStorage.setItem("stationReserve",document.getElementById("nomStation").innerText);
      sessionStorage.setItem("adresseReserve",document.getElementById("adresseStation").innerText);
      //fermer formulaire
      document.getElementById("formulaire-inscription").removeChild(form);
      //ouvrir canvas signature
      canvas();
      e.preventDefault();
    }
  });
};

//fonction mise à jour div reservation
function addReservation() {
  reservationEnCours = false;
  inscriptionButton.style.display = "block";
  document.getElementById("reservation").textContent =
  "Vous avez réservé un velo à la station " +
  sessionStorage.getItem("stationReserve") + ", " +
  sessionStorage.getItem("adresseReserve");
  const majNombreVelo = parseInt(avBikesStationElt.textContent,10)-1;
  avBikesStationElt.textContent = majNombreVelo;
  timerReservation();
  document.getElementById("bouton-inscription-info").textContent = "la réservation d'un nouveau velo annulera la réservation en cours";
};

//fonction timer reservation
function timerReservation() {
  //variable time calculer à partir de sessionstorage
  const dateNow = new Date().getTime();
  const dateReservation = parseInt(sessionStorage.getItem("heureFinReservation"),10);
  time = (dateReservation-dateNow);
  //function timer
  function timer() {
    time = (time-1000);
    const minute = Math.floor(time / 60000);
    const second = ((time%60000)/1000).toFixed(0);
    document.getElementById("timer").textContent = "réservation valide pendant : "
    + minute + " minute(s) " + (second<10 ?"0":"") + second + " seconde(s) ";
    //condition arret timer au bout de 20 minutes ou si l'utilisateur relance une reservation
    if (time<0 || reservationEnCours===true) {
      clearInterval(interval);
      document.getElementById("timer").textContent = "";
      document.getElementById("reservation").textContent = "Pas de réservation en cours";
      document.getElementById("bouton-inscription-info").textContent = "";
      alert("Réservation à la station "+sessionStorage.getItem("stationReserve")+" expirée/annulée");
      sessionStorage.clear();
    };
  };
  //evenement au clic par l'utilisateur pour arreter la reservation
  inscriptionButton.addEventListener("click",function(){
    reservationEnCours = true;
  });
  //lancement timer avec intervalle 1 secondes
  const interval = setInterval(timer, 1000);
};

//fonction de verification si une reservation existe pendant la session
function verificationReservation() {
  if (sessionStorage.getItem("stationReserve") != null){
    if (confirm("Voulez-vous reprendre votre réservation d'un velo à la station "+sessionStorage.getItem("stationReserve"))){
      addReservation();
    } else {
      sessionStorage.clear();
    };
  };
};

//lancement de la fonction d'appel
appelJCDecaux();

//lancement de la fonction de verification si reservation en cours pendant la session
verificationReservation();

//evenement MAJ des marqueurs à la fin d'un deplacement de la carte
mymap.on("moveend",function (){
  updateMap();
});

//evenement clic sur le bouton d'incription
inscriptionButton.addEventListener("click",function () {
  if (nameStationElt.textContent.length === 0) {
    document.getElementById("bouton-inscription-info").textContent = "pas de station selectionnée";
    setTimeout(function() {
      document.getElementById("bouton-inscription-info").textContent = "";
    },5000);
  } else if (Number(avBikesStationElt.textContent)===0) {
    document.getElementById("bouton-inscription-info").textContent = "pas de velo disponible";
    setTimeout(function() {
      document.getElementById("bouton-inscription-info").textContent = "";
    },5000);
  } else if (statutStationElt.textContent === "CLOSED") {
    document.getElementById("bouton-inscription-info").textContent = "la station est fermée";
    setTimeout(function() {
      document.getElementById("bouton-inscription-info").textContent = "";
    },5000);
  } else {
    //afficher formulaire
    reservationEnCours = true;
    AddInscriptionForm();
  };
});
