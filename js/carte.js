//declaration variable
var mymap = L.map('carte').setView([45.760033,4.838189],15);//inialisation carte avec centre et zoom
var calqueMarqueur = L.layerGroup().addTo(mymap); // creation calque pour affichage des marqueurs
var coordMap = mymap.getBounds();//inialisation tableau d'objet des coordonnées
var stations = [];// inialisation tableau objet des stations
var marqueursInfos =[];// tableau info marqueurs
var url = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=3c65f322235f7ce3680b5ba51ce05b8811041058";

//function requete vers api JCDecaux et maj tableau stations
appelJCDecaux();
function appelJCDecaux() {
  ajaxGet(url, function (reponse) { //
      var reponseElt = JSON.parse(reponse);
      stations = reponseElt ;
      AjouterMarqueur();
  });
};

//mise en forme des donnée
//functions ajout marqueurs
function AjouterMarqueur() {
  calqueMarqueur.clearLayers();//effacer marqueurs
  for (var i = 0; i < stations.length; i++) {
    //recuperer position, nom , adresse nb de velo et de stand
    var stationLat = stations[i].position.lat ;
    var stationLng = stations[i].position.lng ;
    var stationName = stations[i].name ;
    var stationAddress = stations[i].address ;
    //var stationBikes = stations[i].totalStands.availabilities.bikes ;
    //var stationsStands = stations[i].totalStands.availabilities.stands ;
    var marqueur = {name: stationName,address:stationAddress,/*bike:stationBikes,
    stand:stationsStands,*/lat:stationLat,lng:stationLng};
    marqueursInfos.push(marqueur);
    //verification position station par rapport limite de la carte affiché
    if ((stationLat<coordMap._northEast.lat)&&(stationLat>coordMap._southWest.lat)
    &&(stationLng<coordMap._northEast.lng)&&(stationLng>coordMap._southWest.lng))
    {
      //generer marqueur
      var marqueur = L.marker([stationLat,stationLng]).addTo(calqueMarqueur);
    };
  };
  console.log(marqueursInfos);
};

//option de la carte mapbox
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic3lsdmFpbmd1ZWxsZSIsImEiOiJjandodnUwbzEwZGx3NDJtano3ZHY3MHlhIn0.zglA2Ncbo2bLKAnY55hK7g'
}).addTo(mymap);

//evenement mise à jour coordonnées à la fin d'un deplacement de la carte
mymap.on('moveend',function (){
  coordMap = mymap.getBounds();
  AjouterMarqueur();
});

//evenement clic sur un marqueur

/*
var stationElt = document.getElementById("main");
var url = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=3c65f322235f7ce3680b5ba51ce05b8811041058";
ajaxGet(url, function (reponse) {
    var reponseElt = JSON.parse(reponse);
    var nomVille = document.createElement("h1");
    nomVille.textContent = "Station JCDecaux de la ville de "+reponseElt[0].contract_name;
    stationElt.appendChild(nomVille);
    for (i=0;i<reponseElt.length;i++){
      var divElt = document.createElement("div");
      var brElt = document.createElement("br");
      var numberStation = document.createElement("h2");
      numberStation.textContent = "station n° : "+reponseElt[i].number;
      var nomStation = document.createElement("h3");
      nomStation.textContent = "Nom : "+reponseElt[i].name;
      var statusStation = document.createElement("p");
      statusStation.textContent = "Status de la station : "+reponseElt[i].status;
      var standStation = document.createElement("p");
      standStation.textContent = " Nombre d'emplacement : "+reponseElt[i].bike_stands;
      var disponibleStation = document.createElement("p");
      disponibleStation.textContent = "Nombre de vélo disponible : "+reponseElt[i].available_bikes;
    };
});*/
