//declaration variable
var mymap = L.map('carte').setView([45.760033,4.838189],15);//inialisation carte avec centre et zoom
var calqueMarqueur = L.layerGroup().addTo(mymap); // creation calque pour affichage des marqueurs
var coordMap = mymap.getBounds();//inialisation tableau d'objet des coordonnées
var stations = [];// inialisation tableau objet des stations
var marqueursInfos ={}// objet info stations marqueurs
var url = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=3c65f322235f7ce3680b5ba51ce05b8811041058";
//element dom à mettre à jour
var nameStationElt = document.getElementById('nomStation');
var addressStationElt = document.getElementById('adresseStation');
var avBikesStationElt = document.getElementById('nbVeloDispoStation');
var avStandsStationElt = document.getElementById('nbEmplacementStation');
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
      var reponseElt = JSON.parse(reponse);
      for (var i = 0; i < reponseElt.length; i++) {
        var marqueursInfos = {
          name: reponseElt[i].name,
          address:reponseElt[i].address,
          bike:reponseElt[i].available_bikes,
          stand:reponseElt[i].bike_stands,
          lat:reponseElt[i].position.lat,
          lng:reponseElt[i].position.lng
        };
        stations.push(marqueursInfos);
      }
      console.log(stations);
      addMarker();
  });
};
appelJCDecaux();

//fonction ajout marqueur sur la carte
function addMarker() {
  calqueMarqueur.clearLayers();//effacer marqueurs
  for (var i = 0; i < stations.length; i++) {
    var marqueur = L.marker([stations[i].lat,stations[i].lng])
    marqueur.options.station = stations[i];
    marqueur.on('click', function (e){
      const currentMarker = e.target;
      console.log(currentMarker.options);
    });
    //verification position station par rapport limite de la carte affiché
    if ((stations[i].lat<coordMap._northEast.lat)&&
    (stations[i].lat>coordMap._southWest.lat)&&
    (stations[i].lng<coordMap._northEast.lng)&&
    (stations[i].lng>coordMap._southWest.lng)) {
      //generer marqueur
      marqueur.addTo(calqueMarqueur);
    };
  };
};

//fonction maj dom
function majDom(e) {
  nameStationElt.textContent = stations[e].name;
  addressStationElt.textContent = stations[e].address;
  avBikesStationElt.textContent = stations[e].bike;
  avStandsStationElt.textContent = stations[e].stand;
  console.log(e);
}
//evenement MAJ coordonnées et marqueurs à la fin d'un deplacement de la carte
mymap.on('moveend',function (){
  coordMap = mymap.getBounds();
  addMarker();
});
