var $carousel = $('#diaporama');// cible la div du diapo
var $imgCarousel = $('#diaporama img');// cible tableau les img du diapo
var indexImg = $imgCarousel.length - 1;// creation index selon nombre image
//inialisation du diapo
i=0;
$currentImg = $imgCarousel.eq(i);//definition de l'image courante = 0
$imgCarousel.css('display','none');//masque toute les img
$currentImg.css('display','block');//affiche l'image courrante

//fonction precedente et suivante
$('.next').click(function(){//cible bouton next et function au clic dessus
  i++;//increment de i
  if( i <= indexImg ){// condition si clic fait passer le i sup au nb d'img
      $imgCarousel.css('display', 'none');//masque
      $currentImg = $imgCarousel.eq(i);//nouvelle img courante
      $currentImg.css('display', 'block');//affiche nouvelle img courante
    }
    else{// si i est passer à une valeur sup aux nb d'img
      i = indexImg;
    }
});

$('.prev').click(function(){
  i--;
  if( i >= 0 ){
    $imgCarousel.css('display', 'none');
    $currentImg = $imgCarousel.eq(i);
    $currentImg.css('display', 'block');
  }
  else{
    i = 0;
  }
});

//fonction slide automatique des image
function slideImg() {
  setTimeout(function(){
    if(i<indexImg){//condition si inferieur à la derniere image
      i++;
    }
    else {//sinon reset de i
      i=0;
    }
    $imgCarousel.css('display','none');//masque
    $currentImg=$imgCarousel.eq(i);//nouvelle img courante
    $currentImg.css('display','block');//affiche nouvelle img courante
    slideImg();//relance la fonction pour creer la boucle infinie
  },5000);
};

slideImg();//premier lancement de la fonction de slide automatique
