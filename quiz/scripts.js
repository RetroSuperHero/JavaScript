let questionContainer = document.querySelector('.question');
let answerContainers = document.querySelectorAll('.answer');
let questionNumberContainer = document.querySelector('.questionNumber');
const time = 32000;
const category = 0;
let questionNumber = 0;
let questionsNumbers = new Array(5);
let questionTimeout;
let questionInterval;
let points = 0;
var asking = false;

window.onload = function() {
    fadeIn("#quizContainer");
    document.querySelector('.mitologia').addEventListener('click', function() {
        display('.gameContainer');
        randomQuestions(data[category].questions.length);
        setEvents();
        setQuestion(questionsNumbers[questionNumber]);
    });
    document.querySelector('.dodaj').addEventListener('click', function() {
        display(".addContainer");
    }); 
    document.getElementById('add').addEventListener('click', add);
}

function setQuestion(id) {
    asking = true;
    var date = new Date();
    var bar = document.querySelector('.bar');
    var left = 30;
    questionInterval = setInterval(function() {
        document.querySelector('.timeLeft').innerHTML = left-- + "s";
        var newDate = new Date();
        bar.style.width = 100 - (newDate.getTime() - date.getTime())/300 + "%";
    }, 1000);
    document.querySelector('.photoContainer').style.backgroundImage = "url(" + data[category].questions[id].image + ")";
    document.querySelector('.backgroundPhoto').style.backgroundImage = "url(" + data[category].questions[id].image + ")";
    questionNumberContainer.innerHTML = questionNumber + 1;
    questionContainer.innerHTML = data[category].questions[id].question + ":";
    document.querySelector('.category').querySelector('span').innerHTML = data[category].category;
    
    let index = 0;
    answerContainers.forEach(answerContainer => {
       answerContainer.innerHTML =  data[category].questions[id].answers[index++];
    });
    
    questionTimeout = setTimeout(function() {
        clearInterval(questionInterval);
        checkAnswer(1);
    }, time);
}

function setEvents() {
    answerContainers.forEach(answer => answer.addEventListener('click', function() {
        if(asking) {
            clearTimeout(questionTimeout);
            clearInterval(questionInterval);
            checkAnswer(answer.dataset.number, this);
        }
    }));
}

function checkAnswer(answer, element = null) {
    asking = false;
    if(element) {
        if(answer == data[category].questions[questionsNumbers[questionNumber]].correct) {
            element.classList.add('right');
            points++;
        } else {
            element.classList.add('wrong');
        }
    }
    setTimeout(function() {
        if(element) {
            element.classList.remove('wrong');
            element.classList.remove('right');
        }
        if(questionNumber<4) {
            setQuestion(questionsNumbers[++questionNumber]);
        } else {
            setResults();
        }
    }, 1000);
}


function setResults() {
    document.querySelector('.photoContainer').style.backgroundImage = "url(" + data[category].image + ")";
    document.querySelector('.backgroundPhoto').style.backgroundImage = "url(" + data[category].image + ")";
    document.querySelector('.bigText').innerHTML = "Wyniki!";
    questionContainer.innerHTML = "Zdobyłeś " + points + "/5 punktów!";
    let index = 0;
    answerContainers.forEach(answerContainer => {
        if(index == 0)
            answerContainer.innerHTML =  "Gratulujemy i życzymy powodzenia w dalszych grach!";
        else
            answerContainer.innerHTML = "";
        index++;
    });
}

function randomQuestions(maxNumber) {
    for(let i=0;i<5;++i) {
        var is = false;
        while(!is) {
            var od = true;
            var number = parseInt(Math.random()*maxNumber);
            for(var j=0; j<i; ++j) {
                if(number === questionsNumbers[j]) {
                    od = false;
                }
            }
            if(od) {
                is = true;
            }
        }
        questionsNumbers[i] = number;
    }
}

function fadeIn(element) { 
    document.querySelector(element).style.top = "50vh";
    setTimeout(function() { 
        document.querySelector(element).style.opacity = "1";
    }, 600);
}

function add() {
    let src = document.querySelector('.photoSrc').value;
    let categories = document.getElementById("categories");
    var selectedCategory = categories.options[categories.selectedIndex].value;
    let newAnswers = document.querySelectorAll('.newAnswer');
    console.log(newAnswers);
    let newQuestion;
    if(!src) src = data[selectedCategory].image;
    newQuestion = {
        "image":src,
        "question":document.querySelector('.newQuestion').querySelector('input').value,
        "answers":[
            newAnswers[0].querySelector('input').value,
            newAnswers[1].querySelector('input').value,
            newAnswers[2].querySelector('input').value,
            newAnswers[3].querySelector('input').value
        ],
    };
    console.log(newQuestion);
    data[selectedCategory].questions.push(newQuestion);
    
    console.log(JSON.stringify(data));
    display(".menuContainer");
}

function display(container) {
    document.querySelector('.addContainer').style.display = "none";
    document.querySelector('.menuContainer').style.display = "none";
    document.querySelector('.gameContainer').style.display = "none";
    document.querySelector(container).style.display = "block";
}

const data = [
   {
      "id":"0",
      "category":"Mitologia",
      "image":"./images/mithology.jpg",
      "questions":[
         {
            "image":"./images/wings.jpg",
            "question":"Bóg uważany za boga nieba i boga wszystkich bogów to",
            "answers":[
               "Afrodyta",
               "Posejdon",
               "Zeus",
               "Hades"
            ],
            "correct":"2",
            "added":"09.06.2018",
            "author":"Eryk Sikora"
         },
         {
            "image":"http://st3.ancientfacts.net/wp-content/uploads/2016/01/greek-gods-e1453392568100.jpg",
            "question":"Rodzeństwo Zeusa to",
            "answers":[
               "Apollo, Gaja, Demeter",
               "Posejdon, Hera, Demeter, Atena",
               "Posejdon, Demeter, Hades, Apollo",
               "Posejdon, Hera, Demeter, Hades"
            ],
            "correct":"3",
            "added":"09.06.2018",
            "author":"Eryk Sikora"
         },
         {
            "image":"./images/heaven.jpg",
            "question":"Jak powstał świat wg mitów greckich",
            "answers":[
               "Na początku był chaos, a z chaosu wyłoniła się Gaja i Uranos",
               "Na początku było niebo, a z nieba wyłoniła się Gaja, a niebem był Uranos",
               "Powstał z potęgi Zeusa",
               "Brak informacji"
            ],
            "correct":"0",
            "added":"09.06.2018",
            "author":"Eryk Sikora"
         },
         {
            "image":"./images/afrodyta.png",
            "question":"Jak nazywał się bóg/bogini sztuki i piękna",
            "answers":[
               "Afrodyta",
               "Hermes",
               "Apollo",
               "Hades"
            ],
            "correct":"2",
            "added":"09.06.2018",
            "author":"Eryk Sikora"
         },
         {
            "image":"./images/hercules.jpg",
            "question":"Najtrudniejsze zadanie Herkulesa to",
            "answers":[
               "Stajnia Augiasza",
               "Wielogłowa Hydra",
               "Złote jabłka z ogrodu",
               "..."
            ],
            "correct":"1",
            "added":"09.06.2018",
            "author":"Eryk Sikora"
         },
         {
            "image":"./images/nymphes.jpg",
            "question":"Jak nazywał się młodzieniec, który zmarł z tęsknoty za własnym odbiciem",
            "answers":[
               "Bratek",
               "Hermes",
               "Narcyz",
               "Augiasz"
            ],
            "correct":"2",
            "added":"09.06.2018",
            "author":"Eryk Sikora"
         },
         {
            "image":"http://4.bp.blogspot.com/-KIZj764TnWM/VVCcjlOPaoI/AAAAAAAACt0/sECmu9DJDwc/s1600/Hand%2Bpainted%2B01grreek.jpg",
            "question":"Widniejąca na zdjęciu królewna kreteńska, córka króla Katreusa to",
            "answers":[
               "Aerope",
               "Afrodyta",
               "Gaja",
               "Agamemnon"
            ],
            "correct":"0",
            "added":"09.06.2018",
            "author":"Eryk Sikora"
         },
         {
            "image":"https://www.ancient.eu/uploads/images/4130.jpg?v=1485681486",
            "question":"Zeus, by zostać królem greckich bogów, musiał zabić swojego tatę",
            "answers":[
               "Uranosa",
               "Kronosa",
               "Promoeteusza",
               "Atlasa"
            ],
            "correct":"1",
            "added":"05.07.2018",
            "author":"Eryk Sikora"
         },
         {
            "image":"http://static.t13.cl/images/sizes/1200x675/1467786289-90301721carracci-jupiteretjunon.jpg",
            "question":"Jaki ptak kojarzony jest z Herą",
            "answers":[
               "Sokół",
               "Sikorka",
               "Słowik",
               "Paw"
            ],
            "correct":"3",
            "added":"06.07.2018",
            "author":"Eryk Sikora"
         },
         {
            "image":"http://www.4enoch.org/wiki4/images/3/37/Muses.jpg",
            "question":"Czyimi córkami były muzy Apollina",
            "answers":[
               "Posejdona i Meduzy",
               "Apollina i Tyche",
               "Dzeusa i Mnemosyne",
               "Apollinai Dafne"
            ],
            "correct":"2",
            "added":"06.07.2018",
            "author":"Eryk Sikora"
         }
      ]
   }
]