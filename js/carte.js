class Map {
  constructor (urlContract,latContract,lngContract,zoom) {
    //declaration variable
    this.mymap = L.map("carte").setView([latContract,lngContract],zoom);//inialisation carte avec centre et zoom
    this.calqueMarqueur = L.layerGroup().addTo(this.mymap); // creation calque pour affichage des marqueurs
    //option de la carte mapbox
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: "pk.eyJ1Ijoic3lsdmFpbmd1ZWxsZSIsImEiOiJjandodnUwbzEwZGx3NDJtano3ZHY3MHlhIn0.zglA2Ncbo2bLKAnY55hK7g"
    }).addTo(this.mymap);

    this.url = urlContract;

    this.stations = [];// inialisation tableau des stations
    this.time = 0; //variable pour le timer de reservation

    //element dom à mettre à jour
    this.nameStationElt = document.getElementById("nomStation");
    this.addressStationElt = document.getElementById("adresseStation");
    this.avBikesStationElt = document.getElementById("nbVeloDispoStation");
    this.avStandsStationElt = document.getElementById("nbEmplacementStation");
    this.inscriptionButton = document.getElementById("bouton-incription");
    this.reservationElt = document.getElementById("reservation");
    this.statutStationElt = document.getElementById("statutStation");
  };


  //function requete vers api JCDecaux et maj tableau stations
  appelJCDecaux() {
    console.log(this.stations);
    ajaxGet(this.url, function (reponse) {
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
        this.stations.push(marqueursInfos);//TypeError: this is undefined
      };
      this.updateMap();//TypeError: this is undefined
    });
  };

  //fonction ajout ou maj des marqueurs sur la carte
  updateMap() {
    this.calqueMarqueur.clearLayers();//effacer marqueurs
    for (let i = 0; i < this.stations.length; i++) {
      const marqueur = L.marker([this.stations[i].lat,this.stations[i].lng]);
      marqueur.options.station = this.stations[i];
      marqueur.on("click", function (e){
        if (document.getElementById("form-button") === null &
        document.getElementById("canvas-button") === null) {
          const currentMarker = e.target;
          this.nameStationElt.textContent = currentMarker.options.station.name;
          this.addressStationElt.textContent = currentMarker.options.station.address;
          this.avBikesStationElt.textContent = currentMarker.options.station.bike;
          this.avStandsStationElt.textContent = currentMarker.options.station.stand;
          this.statutStationElt.textContent = currentMarker.options.station.status;
        } else {
          alert("Vous ne pouvez pas modifier la station lors d'un réservation")
        };
      });
      //verification position station par rapport limite de la carte affiché
      if ((this.stations[i].lat<this.mymap.getBounds()._northEast.lat)&&
      (this.stations[i].lat>this.mymap.getBounds()._southWest.lat)&&
      (this.stations[i].lng<this.mymap.getBounds()._northEast.lng)&&
      (this.stations[i].lng>this.mymap.getBounds()._southWest.lng)) {
        //generer marqueur
        marqueur.addTo(this.calqueMarqueur);
      };
    };
  };

  //fonction formulaire inscription
  AddInscriptionForm() {
    this.inscriptionButton.style.display = "none";//masque le bouton de reservation
    //ajout du formulaire
    /*const formBr = document.createElement("br");*/
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
    /*form.appendChild(formBr);*/
    form.appendChild(formButton);
    document.getElementById("formulaire-inscription").appendChild(form);
    //evenement validation formulaire
    formButton.addEventListener("click", function (e){
      if (formNom.value.length===0||formPrenom.value.length===0) {
        alert("Veuillez remplir le nom et le prénom")
      } else {
        //stocker données de reservation avec sessionstorage
        /*a deplacer pour stocker aprés validation canvas
        car bug si actualisation page durant signature*/
        sessionStorage.setItem("stationReserve",document.getElementById("nomStation").innerText);
        sessionStorage.setItem("adresseReserve",document.getElementById("adresseStation").innerText);
        //stocker données formulaire avec local storage
        localStorage.setItem("nom",form[0].value) ;
        localStorage.setItem("prenom",form[1].value);
        //fermer formulaire
        document.getElementById("formulaire-inscription").removeChild(form);
        //ouvrir canvas signature
        canvas();
        e.preventDefault();
      }
    });
  };

  //fonction mise à jour div reservation
  addReservation() {
    this.inscriptionButton.style.display = "block";
    document.getElementById("reservation").textContent =
    "Vous avez réservé un velo à la station " +
    sessionStorage.getItem("stationReserve") + ", " +
    sessionStorage.getItem("adresseReserve");
    this.timerReservation();
    document.getElementById("bouton-inscription-info").textContent = "la réservation d'un nouveau velo annulera la réservation en cours";
  };

  //fonction timer reservation
  timerReservation() {
    //variable time calculer à partir de sessionstorage
    const dateNow = new Date().getTime();
    const dateReservation = parseInt(sessionStorage.getItem("heureFinReservation"),10);
    this.time = (dateReservation-dateNow);
    //function timer
    function timer() {
      this.time = (this.time-1000);
      const minute = Math.floor(this.time / 60000);
      const second = ((this.time%60000)/1000).toFixed(0);
      document.getElementById("timer").textContent = "réservation valide pendant : "
      + minute + " minute(s) " + (second<10 ?"0":"") + second + " seconde(s) ";
      //condition arret timer au bout de 20 minutes ou si l'utilisateur relance une reservation
      if (this.time<0) {
        clearInterval(interval);
        document.getElementById("timer").textContent = "";
        document.getElementById("reservation").textContent = "Pas de réservation en cours";
        document.getElementById("bouton-inscription-info").textContent = "";
        alert("Réservation à la station "+sessionStorage.getItem("stationReserve")+" expirée/annulée");
        sessionStorage.clear();
      };
    };
    const interval = setInterval(timer, 1000);
  };

  //fonction de verification si une reservation existe pendant la session
  verificationReservation() {
    if (sessionStorage.getItem("stationReserve") != null){
      if (confirm("Voulez-vous reprendre votre réservation d'un velo à la station "+sessionStorage.getItem("stationReserve")+" ?")){
        addReservation();
      } else {
        sessionStorage.clear();
      };
    };
  };
};

const mapLyon = new Map ("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=3c65f322235f7ce3680b5ba51ce05b8811041058",
45.760033,4.838189,15);
//lancement de la fonction d'appel
mapLyon.appelJCDecaux();

//lancement de la fonction de verification si reservation en cours pendant la session
mapLyon.verificationReservation();

//evenement MAJ des marqueurs à la fin d'un deplacement de la carte
mapLyon.mymap.on("moveend",function (){
  mapLyon.updateMap();
});

//evenement clic sur le bouton d'incription
mapLyon.inscriptionButton.addEventListener("click",function () {
  mapLyon.time = 0;//repasse time à 0 pour annuler une reservation existante
  if (mapLyon.nameStationElt.textContent.length === 0) {
    document.getElementById("bouton-inscription-info").textContent = "pas de station selectionnée";
    setTimeout(function() {
      document.getElementById("bouton-inscription-info").textContent = "";
    },5000);
  } else if (Number(mapLyon.avBikesStationElt.textContent)===0) {
    document.getElementById("bouton-inscription-info").textContent = "pas de velo disponible";
    setTimeout(function() {
      document.getElementById("bouton-inscription-info").textContent = "";
    },5000);
  } else if (mapLyon.statutStationElt.textContent === "CLOSED") {
    document.getElementById("bouton-inscription-info").textContent = "la station est fermée";
    setTimeout(function() {
      document.getElementById("bouton-inscription-info").textContent = "";
    },5000);
  } else {
    //afficher formulaire
    mapLyon.AddInscriptionForm();
  };
});
