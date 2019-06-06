//declaration variable
const mymap = L.map('carte').setView([45.760033,4.838189],15);//inialisation carte avec centre et zoom
const calqueMarqueur = L.layerGroup().addTo(mymap); // creation calque pour affichage des marqueurs
let stations = [];// inialisation tableau objet des stations
const url = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=3c65f322235f7ce3680b5ba51ce05b8811041058";
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
  const formBr = document.createElement('br');
  const formNom = document.createElement('input');
  formNom.defaultValue = "Nom";
  formNom.required = true;
  const formPrenom = document.createElement('input');
  formPrenom.defaultValue = "Prenom";
  formPrenom.required = true;
  const formButton = document.createElement('button');
  formButton.textContent = "Valider la réservation";
  formButton.classList.add("btn","btn-success");
  const form = document.createElement('form');
  form.appendChild(formNom);
  form.appendChild(formBr);
  form.appendChild(formPrenom);
  form.appendChild(formBr);
  form.appendChild(formButton);
  document.getElementById('formulaire-inscription').appendChild(form);
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

      //evenement validation formulaire
      //ouvrir canvas signature
      //valider canvas
      //maj texte zone reservation
      //timer 20 minutes
      //reset de la reservation
    }
    else {
      //faire un delais puis effacer le contenue
      document.getElementById('bouton-inscription-info').textContent = 'pas de velo disponible'
    }
  }
  else {
    //faire un delais puis effacer le contenue
    document.getElementById('bouton-inscription-info').textContent = 'pas de station selectionnée'
  }
});
