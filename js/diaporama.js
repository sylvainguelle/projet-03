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
  }
}

//fonction precedente et suivante
document.getElementById("next").addEventListener("click",function(){//cible bouton next et function au clic dessus
  currentSlide++;//increment de i
  if( currentSlide <= indexImg ){// condition si clic fait passer le i sup au nb d'img
      imgDisplayNone();//masque
      currentImg = imgCarousel[currentSlide];//nouvelle img courante
      currentImg.style.display = "block";//affiche nouvelle img courante
    }
    else{// si i est passer à une valeur sup aux nb d'img
      currentSlide = indexImg;
    }
});

document.getElementById("prev").addEventListener("click",function(){
  currentSlide--;
  if( currentSlide >= 0 ){
    imgDisplayNone();
    currentImg = imgCarousel[currentSlide];
    currentImg.style.display = "block";
  }
  else{
    currentSlide = 0;
  }
});

document.getElementById("pause").addEventListener("click",function(){
  pause = !pause;
});

//fonction slide automatique des image
function slideImg() {
  const timer = setInterval(function(){
    if (pause==false) {
      if(currentSlide<indexImg){//condition si inferieur à la derniere image
          currentSlide++;
      }
      else {//sinon reset de i
          currentSlide=0;
      }
      imgDisplayNone();//masque
      currentImg=imgCarousel[currentSlide];//nouvelle img courante
      currentImg.style.display = "block";//affiche nouvelle img courante
    };
    },5000);
};

slideImg();//premier lancement de la fonction de slide automatique
