const karty = document.querySelectorAll(".karta"),
timeTag = document.querySelector(".time b"),
obrotTag = document.querySelector(".obroty b"),
odswiez = document.querySelector(".menu .reset");
var audio = document.getElementById('muzyka');

let czas = 30;
let zostalo = czas;
let obroty = 0;
let czyGra = false;
let timer;
let wyborPierwszy, wyborDrugi;
let wylacz = false;
let licznik = 0;

audio.volume = 0.3;

function obrotKarty({target: zaznaczona}) {
    if(!czyGra){
        czyGra = true;
        timer = setInterval(liczCzas, 1000);
    }
    if(zaznaczona !== wyborPierwszy && !wylacz && zostalo > 0) {
        obroty++;
        obrotTag.innerText = obroty;
        zaznaczona.classList.add("obrot");
        if(!wyborPierwszy) {
            return wyborPierwszy = zaznaczona;
        }
        wyborDrugi = zaznaczona;
        wylacz = true;
        let wyborPierwszyImg = wyborPierwszy.querySelector("img").src,
        wyborDrugiImg = wyborDrugi.querySelector("img").src;
        porownajKarty(wyborPierwszyImg, wyborDrugiImg);
    }
}

function porownajKarty(img1, img2){
    if(img1 === img2) {
        licznik++;
        if(licznik == 6 && zostalo > 0) {
            return clearInterval(timer);
        }
        wyborPierwszy.removeEventListener("click", obrotKarty);
        wyborDrugi.removeEventListener("click", obrotKarty);
        wyborPierwszy = wyborDrugi = "";
        return wylacz = false;
    }
    setTimeout(() => {
        wyborPierwszy.classList.add("shake");
        wyborDrugi.classList.add("shake");
    }, 400);

    setTimeout(() => {
        wyborPierwszy.classList.remove("shake", "obrot");
        wyborDrugi.classList.remove("shake", "obrot");
        wyborPierwszy = wyborDrugi = "";
        wylacz = false;
    }, 800);
}

function potasuj() {
    zostalo = czas;
    obroty = licznik = 0;
    wyborPierwszy = wyborDrugi = "";
    clearInterval(timer);
    timeTag.innerText = zostalo;
    obrotTag.innerText = obroty;
    wylacz = czyGra = false;

    let tablicaLosujaca = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
    tablicaLosujaca.sort(() => Math.random() > 0.5 ? 1 : -1);
    
    karty.forEach((karta, i) => {
        karta.classList.remove("obrot");
        let imgLos = karta.querySelector("img");
        imgLos.src = `img/karta${tablicaLosujaca[i]}.png`;
        karta.addEventListener("click", obrotKarty);
    });
}

karty.forEach(karta => {
    karta.addEventListener("click", obrotKarty);
});

function liczCzas(){
    if(zostalo <= 0){
        return clearInterval(timer);
    }
    zostalo--;
    timeTag.innerText = zostalo;
}

function stopPlayMusic() {
    var audio = document.getElementById('muzyka');
    if(audio.paused){
        audio.play();
    }
    else{
        audio.pause();
    }
}

odswiez.addEventListener("click", potasuj);
potasuj();

