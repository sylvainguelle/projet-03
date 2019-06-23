//declaration variable
const mymap = L.map("carte").setView([45.760033,4.838189],15);//inialisation carte avec centre et zoom
const calqueMarqueur = L.layerGroup().addTo(mymap); // creation calque pour affichage des marqueurs
const url = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=3c65f322235f7ce3680b5ba51ce05b8811041058";
let stations = [];// inialisation tableau objet des stations
let time = 0 //variable pour le timer de reservation
//element dom à mettre à jour
const nameStationElt = document.getElementById("nomStation");
const addressStationElt = document.getElementById("adresseStation");
const avBikesStationElt = document.getElementById("nbVeloDispoStation");
const avStandsStationElt = document.getElementById("nbEmplacementStation");
const inscriptionButton = document.getElementById("bouton-incription");
const reservationElt = document.getElementById("reservation");
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
    marqueur.on("click", function (e){
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
  //Condition pour ne pas afficher plusieur fois le formulaire
  if((!document.getElementById("form-button")) && (!document.querySelector("canvas"))){
    const formBr = document.createElement("br");
    const formNom = document.createElement("input");
    formNom.type = "text";
    formNom.name = "nom";
    formNom.required = true;
    const formPrenom = document.createElement("input");
    formPrenom.type = "text";
    formPrenom.name = "prenom";
    formPrenom.required = true;
    //verifier si nom prenom sont stocker et les afficher
    if (localStorage.getItem("nom")==null) {
      formNom.defaultValue = "Nom";
    }
    else {
      formNom.defaultValue = localStorage.getItem("nom");
    }
    if (localStorage.getItem("prenom")==null) {
      formPrenom.defaultValue = "Prénom";
    }
    else {
      formPrenom.defaultValue = localStorage.getItem("prenom");
    }
    const formButton = document.createElement("button");
    formButton.textContent = "Valider la réservation";
    formButton.classList.add("btn","btn-success");
    formButton.id = "form-button";
    const form = document.createElement("form");
    form.appendChild(formNom);
    form.appendChild(formPrenom);
    form.appendChild(formBr);
    form.appendChild(formButton);
    document.getElementById("formulaire-inscription").appendChild(form);
    //evenement validation formulaire
    formButton.addEventListener("click", function (e){
      //stocker données formulaire avec local storage
      localStorage.setItem("nom",form[0].value) ;
      localStorage.setItem("prenom",form[1].value);
      //stocker données de reservation avec sessionstorage
      sessionStorage.setItem("stationReserve",document.getElementById("nomStation").innerText);
      sessionStorage.setItem("adresseReserve",document.getElementById("adresseStation").innerText);
      //obtenir heure de fin de reservation et la stocker avec sessionstorage
      const dateEndReservation = new Date().getTime()+20*60*1000;
      sessionStorage.setItem("heureFinReservation",dateEndReservation);
      //fermer formulaire
      document.getElementById("formulaire-inscription").removeChild(form);
      //ouvrir canvas signature
      canvas();
      e.preventDefault();
    });
  };
};

//fonction mise à jour div reservation
function addReservation() {
  document.getElementById("reservation").textContent =
  "Vous avez réservé un velo à la station "+
  sessionStorage.getItem("stationReserve")+", "+
  sessionStorage.getItem("adresseReserve");
  timerReservation();
  document.getElementById("bouton-inscription-info").textContent = "la réservation d'un nouveau velo annulera la réservation en cours";
};

//fonction timer reservation
function timerReservation() {
  //variable time calculer à partir de sessionstorage
  const dateNow = new Date().getTime();
  const dateReservation = parseInt(sessionStorage.getItem("heureFinReservation"),10)
  time = (dateReservation-dateNow);
  //function timer
  function timer() {
    time = (time-1000);
    const minute = Math.floor(time / 60000);
    const second = ((time%60000)/1000).toFixed(0);
    //console.log(minute+":"+(second<10 ?'0':'')+second);
    document.getElementById("timer").textContent = "réservation valide pendant : "
    +minute+" minute(s) "+(second<10 ?"0":"")+second+" seconde(s) ";
    if (time<0) {
      clearInterval(interval);
      document.getElementById("timer").textContent = "";
      document.getElementById("reservation").textContent = "Pas de réservation en cours";
      document.getElementById("bouton-inscription-info").textContent = "";
      alert("Réservation à la station "+sessionStorage.getItem("stationReserve")+" expirée/annulée");
    };
  };
    inscriptionButton.addEventListener("click",function(){
      clearInterval(interval);
      document.getElementById("timer").textContent = "";
      document.getElementById("reservation").textContent = "Pas de réservation en cours";
      document.getElementById("bouton-inscription-info").textContent = "";
      alert("Réservation à la station "+sessionStorage.getItem("stationReserve")+" expirée/annulée");
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
    }
  };
}

//lancement de la fonction d'appel
appelJCDecaux();

//lancement de la fonction de verification si reservation en cours pendant la session
verificationReservation();

//evenement MAJ des marqueurs à la fin d'un deplacement de la carte
mymap.on("moveend",function (){
  updateMap();
});

//evenement clic sur le bouton d'incription
inscriptionButton.addEventListener("click",function(){
  //verifier qu'une station est bien selectionnée
  if (nameStationElt.textContent.length>0) {
    //verifier si velo dispo >0
    if (Number(avBikesStationElt.textContent)>0) {
      //afficher formulaire
      AddInscriptionForm();
    }
    else {
      document.getElementById("bouton-inscription-info").textContent = "pas de velo disponible";
      setTimeout(function() {
        document.getElementById("bouton-inscription-info").textContent = "";
      },5000);
    }
  }
  else {
    document.getElementById("bouton-inscription-info").textContent = "pas de station selectionnée";
    setTimeout(function() {
      document.getElementById("bouton-inscription-info").textContent = "";
    },5000);
  }
});
