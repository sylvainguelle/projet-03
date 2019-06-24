const carousel = document.getElementById("diaporama");// cible la div du diapo
const imgCarousel = document.getElementById("diaporama").querySelectorAll("img");// cible tableau les img du diapo
const indexImg = imgCarousel.length - 1;// creation index selon nombre image
let pause = false;// variable etat bouton pause
//inialisation du diapo
let currentSlide = 0;
currentImg = imgCarousel[currentSlide];//definition de l'image courante = 0
imgDisplayNone();
currentImg.style.display = "block";//affiche l'image courrante

//fonction masquer toute les images
function imgDisplayNone() {
  for (i=0;i<imgCarousel.length;i++) {
    imgCarousel[i].style.display = "none";//masque toute les img
  };
};

//fonction slide suivant
function nextSlide(){
  currentSlide++;//increment de i
  if( currentSlide <= indexImg ){
      imgDisplayNone();//masque
      currentImg = imgCarousel[currentSlide];//nouvelle img courante
      currentImg.style.display = "block";//affiche nouvelle img courante
    } else {// si i est passer à une valeur sup aux nb d'img
      currentSlide = indexImg;
    };
};

//fonction slide precedent
function prevSlide(){
  currentSlide--;
  if( currentSlide >= 0 ){
    imgDisplayNone();
    currentImg = imgCarousel[currentSlide];
    currentImg.style.display = "block";
  } else {
    currentSlide = 0;
  };
};

//fonction slide automatique des image
function slideImg() {
  const timer = setInterval(function(){
    if (pause==false) {
      if(currentSlide<indexImg){//condition si inferieur à la derniere image
          currentSlide++;
      } else {//sinon reset de i
          currentSlide=0;
      };
    imgDisplayNone();//masque
    currentImg=imgCarousel[currentSlide];//nouvelle img courante
    currentImg.style.display = "block";//affiche nouvelle img courante
    };
  },5000);
};

slideImg();//premier lancement de la fonction de slide automatique

//evenement appuie sur bouton pause
document.getElementById("pause").addEventListener("click",function(){
  pause = !pause;
});

//evenement clic sur bouton precedent
document.getElementById("prev").addEventListener("click",prevSlide);

//evenement clic sur bouton next
document.getElementById("next").addEventListener("click",nextSlide);

//evenement appuie sur fleche droite ou gauche
document.addEventListener("keydown", function(e) {
  if (e.keyCode === 37 ) {
    prevSlide();
  }
  else if (e.keyCode === 39 ) {
    nextSlide();
  };
});
