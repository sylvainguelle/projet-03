class Diaporama {
  constructor (diaporamaId,pauseBtnId,prevBtnId,nextBtnId) {
    this.carousel = document.getElementById(diaporamaId);// cible la div du diapo
    this.imgCarousel = this.carousel.querySelectorAll("img");// cible tableau les img du diapo
    this.indexImg = this.imgCarousel.length - 1;// creation index selon nombre image
    this.pauseState = false;// variable etat bouton pause
    this.pauseButton = document.getElementById(pauseBtnId);
    this.prevButton = document.getElementById(prevBtnId);
    this.nextButton = document.getElementById(nextBtnId);
    this.iconPause = document.getElementById("icon-pause-tuto");
    this.iconPlay = document.getElementById("icon-play-tuto");
    //inialisation du diapo
    this.currentSlide = 0;
    this.currentImg = this.imgCarousel[this.currentSlide];//definition de l'image courante = 0
    this.imgDisplayNone();
    this.updatePauseStyle();
    this.slideImg();
    this.currentImg.style.display = "block";//affiche l'image courrante
    //ecouteur d'evenement
    this.pauseButton.addEventListener("click",()=> {
      this.pause();
    });
    this.prevButton.addEventListener("click",()=> {
      this.prevSlide()
    });
    this.nextButton.addEventListener("click",()=> {
      this.nextSlide();
    });
    //evenement appuie sur fleche droite ou gauche
    document.addEventListener("keydown", (e)=> {
      if (e.keyCode === 37 ) {
        this.prevSlide();
      }
      else if (e.keyCode === 39 ) {
        this.nextSlide();
      };
    });
  }

  //fonction masquer toute les images
  imgDisplayNone() {
    for (let i=0;i < this.imgCarousel.length;i++) {
      this.imgCarousel[i].style.display = "none";//masque toute les img
    };
  };

  //fonction slide suivant
  nextSlide(){
    this.currentSlide++;//increment de i
    if( this.currentSlide <= this.indexImg ){
        this.imgDisplayNone();//masque
        this.currentImg = this.imgCarousel[this.currentSlide];//nouvelle img courante
        this.currentImg.style.display = "block";//affiche nouvelle img courante
      } else {// si i est passer à une valeur sup aux nb d'img
        this.currentSlide = this.indexImg;
      };
  };

  //fonction slide precedent
  prevSlide(){
    this.currentSlide--;
    if( this.currentSlide >= 0 ){
      this.imgDisplayNone();
      this.currentImg = this.imgCarousel[this.currentSlide];
      this.currentImg.style.display = "block";
    } else {
      this.currentSlide = 0;
    };
  };

  autoSlide(){
    if (this.pauseState === false) {
      if(this.currentSlide<this.indexImg){//condition si inferieur à la derniere image
          this.currentSlide++;
      } else {//sinon reset de i
          this.currentSlide=0;
      };
    this.imgDisplayNone();//masque
    this.currentImg=this.imgCarousel[this.currentSlide];//nouvelle img courante
    this.currentImg.style.display = "block";//affiche nouvelle img courante
    };
  }

  //fonction slide automatique des image
  slideImg() {
    setInterval(this.autoSlide.bind(this),5000);
  };

  //fonction pause
  pause(){
    this.pauseState = !this.pauseState;
    this.updatePauseStyle();
  };

  updatePauseStyle() {
    if (this.pauseState === false){
      this.iconPause.style.display = "block";
      this.iconPlay.style.display = "none";
    } else {
      this.iconPause.style.display = "none";
      this.iconPlay.style.display = "block";
    }
  }
};

const diaporamaTutoriel = new Diaporama("diaporama-tuto","btn-pause-tuto","btn-prev-tuto","btn-next-tuto");
