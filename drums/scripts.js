//Zmienne globalne
const instruments = ['crash', 'hi_tom', 'low_tom', 'openhat', 'hihat', 'kick', 'snare', 'cowbell'];
let playing = false;
let columnsNumber = 16;
let mouseDown = false;
let speed = 150;
let instrumentsNumber = instruments.length;
let currRandom = 6;

let columnsArray;
let boxesArray;
let grid;
let interval;

//Inicjalizowanie pola
window.onload = function() {
    generateHtml();
    setArrays();
    setEvents();
    //grid = [[0,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,1,0,0,0],[0,1,0,0,1,0,0,0],[0,1,0,0,0,0,1,0],[0,0,1,0,0,1,0,0],[0,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,0,0,1,0],[0,0,1,0,0,1,0,0],[0,0,0,0,1,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,0,0,1,0,0],[0,0,1,0,1,1,0,0]];
    grid = [[0,0,0,1,0,0,0,0],[1,0,0,0,0,0,1,1],[0,0,0,1,0,0,0,0],[1,0,0,0,0,0,0,0],[0,0,0,0,1,0,1,0],[1,0,0,0,0,1,0,0],[0,0,0,1,0,0,0,0],[0,1,0,0,0,0,0,1],[0,1,0,0,0,0,1,0],[0,0,1,1,0,0,1,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,1,0,1,0,0],[0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0]];
    taskGrid = [[0,0,0,0,1,0,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,0,1,0],[0,0,0,0,1,0,0,0],[0,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1],[0,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,1,0,0],[0,1,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0]];//WOLNO
    showBoxes();
}


//Funkcja znajdująca index elementu
function elementIndex(element) {
    return element === this;
}

function submit() {
    if(JSON.stringify(grid) === JSON.stringify(taskGrid))
        window.alert("Udało Ci się!");
    else 
        window.alert("Spróbuj jeszcze raz!");
}

function showTask() {
    for (let i=0; i <grid.length; i++)
        grid[i] = taskGrid[i].slice();
    showBoxes();
}

//Funkcja odtwarzająca dzwięki
function playSound(sound) {
    const audio = document.querySelector(`audio[data-instrument="${sound}"]`);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
}

//Funkcja grająca muzykę bez grafiki
function taskPlay() {
    playBtn = document.getElementsByClassName('taskPlay')[0].getElementsByTagName('p')[0];
    if(!playing) {
        playBtn.textContent = "TASKPAUSE";
        resetPointer();
        let start = 0;
        interval = setInterval(function() {
            for(var i=0;i<instrumentsNumber;++i) {
                if(taskGrid[start][i]) {
                    playSound(instruments[i]);
                }
            }
            if((start+1)%columnsNumber == 0) {
                playBtn.textContent = "TASKPLAY";
                playing = false;
                clearInterval(interval);
            }
            start = (start + 1);
        }, speed);
        playing = true;
    } else {
        playBtn.textContent = "TASKPLAY";
        clearInterval(interval);
        playing = false;
        resetPointer();
    }
}

//Funkcja włączająca muzykę
function playMusic() {
    playBtn = document.getElementsByClassName('play')[0].getElementsByTagName('p')[0];
    if(!playing) {
        playBtn.textContent = "PAUSE";
        resetPointer();
        let start = 0;
        interval = setInterval(function() {
            if(start>0) {
                nowPlaying(start-1, true);
            } else {
                nowPlaying(columnsNumber-1, true);
            }
            nowPlaying(start);
            for(var i=0;i<instrumentsNumber;++i) {
                if(grid[start][i]) {
                    playSound(instruments[i]);
                }
            }
            start = (start + 1)%columnsNumber;
        }, speed);
        playing = true;
    } else {
        playBtn.textContent = "PLAY";
        clearInterval(interval);
        playing = false;
        resetPointer();
    }
}

//Funkcja generująca pole
function generateHtml() {
    const container = document.querySelector('.mixerContainer');
    let containerHTML = '';
    let columnHTML = '<div class="column">';
    for(var i=0; i<instrumentsNumber; ++i) {
        columnHTML += '<div class="box"><div class="inner"></div></div>' 
    }
    columnHTML += '</div>';
    for(var i=0; i<columnsNumber; ++i) {
        containerHTML += columnHTML;
    }
    container.innerHTML = containerHTML;
}

function removeTransition(e) {
    if (e.propertyName !== 'width') return;
    e.target.classList.remove('fullBar');
} 

//Funkcja ustawiająca tablice elementów
function setArrays() {
    columnsArray = Array.from(document.querySelectorAll('.column'));
    columnsArray.forEach(column => { column.style.width = 100/columnsNumber + "%"; });

    boxesArray = Array.from(document.querySelectorAll('.box'));
    boxesArray.forEach(box => { box.style.height = (100*0.8*0.6)/columnsNumber + "vw"; });
    
    buttons = document.querySelectorAll('.button');
    buttons.forEach(button => { button.style.height = (100*0.8*0.6)/columnsNumber + "vw"; });
    
    sounds = document.querySelectorAll('.sound');
    sounds.forEach(sound => { sound.style.height = (100*0.8*0.6)/columnsNumber + "vw"; });
    
    sounds.forEach(key => key.childNodes[3].addEventListener('transitionend', removeTransition));
}

//Funkcja ustawiająca eventListenery
function setEvents() {
    const body = document.querySelector('body');
    body.addEventListener('mousedown', function() { 
        mouseDown = true;
    });
    body.addEventListener('mouseup', function() { 
        mouseDown = false;
    });
    
    boxesArray.forEach(box => box.addEventListener('click', function() {
        var i = columnsArray.findIndex(elementIndex, this.parentNode); 
        var j = (boxesArray.findIndex(elementIndex, this))%instrumentsNumber; 
        box.querySelector('.inner').classList.toggle(instruments[j]);
        grid[i][j] = !grid[i][j];
        if(!playing) {
            playSound(instruments[j]);
        }
        var aaa = document.querySelectorAll('.sound');
        aaa[j].querySelector('div').classList.add('fullBar');
    }));
    
    boxesArray.forEach(box => box.addEventListener('mouseover', function() {
        if(mouseDown) {
            var i = columnsArray.findIndex(elementIndex, this.parentNode); 
            var j = (boxesArray.findIndex(elementIndex, this))%instrumentsNumber; 
            box.querySelector('.inner').classList.toggle(instruments[j]);
            grid[i][j] = !grid[i][j];
            if(!playing) {
                playSound(instruments[j]);
            }
            var aaa = document.querySelectorAll('.sound');
            aaa[j].querySelector('div').classList.add('fullBar');
        }
    }));

    const play = document.querySelector('.play');
    play.addEventListener('click', playMusic);
    
    const restart = document.querySelector('.restart');
    restart.addEventListener('click', restartGrid);
    
    const random = document.querySelector('.random');
    random.addEventListener('click', randomGrid);
    
    const randomCount = document.querySelector('#randomCount');
    randomCount.addEventListener('input', changeRandom);
    
    const taskPlayBtn = document.querySelector('.taskPlay');
    taskPlayBtn.addEventListener('click', taskPlay);
    
    const submitBtn = document.querySelector('.submit');
    submitBtn.addEventListener('click', submit);
    
    const showTaskBtn = document.querySelector('.showTask');
    showTaskBtn.addEventListener('click', showTask);
    
    function changeRandom() {
        if(mouseDown) {
            currRandom = 16 - this.value;
            randomGrid();
        }
    }
    
    const speedCount = document.querySelector('#speedCount');
    speedCount.addEventListener('input', changeSpeed);
    
    function changeSpeed() {
        if(mouseDown) {
            speed = this.value;
            playMusic();
            playMusic();
        }
    }
}

//Funcja resetująca przyciski
function restartGrid() {
    for(var i=0;i<columnsNumber;++i) {
        for(var j=0;j<instrumentsNumber;++j) {
            grid[i][j] = false;
        }
    }
    showBoxes();
}

//Funkcja ustawiająca wygląd boxów
function showBoxes() {
    for(var i=0;i<columnsNumber;++i) {
        for(var j=0;j<instrumentsNumber;++j) {
            nowPlaying(i,true);
            if(grid[i][j]) {
                boxesArray[instrumentsNumber*i+j].querySelector('.inner').classList.add(instruments[j]);
            } else {
                boxesArray[instrumentsNumber*i+j].querySelector('.inner').classList.remove(instruments[j]);
            }
        }
    }
}

//Funkcja generująca losowe dzięki
function randomGrid() {
    restartGrid();
    for(var i=0;i<columnsNumber;++i) {
        for(var j=0;j<instrumentsNumber;++j) {
            if(!parseInt(Math.random()*currRandom)) {
                grid[i][j] = true;
            }
        }
    }
    showBoxes();
}

//Funkcja resetująca wskaźnik
function resetPointer() {
        for(var i=0; i<columnsNumber;++i) {
            nowPlaying(i,true);
        }
}

//Funcja generująca wskaźnik
function nowPlaying(id, remove = false) {
    for(var i=0;i<instrumentsNumber;++i) {
        var index = id*instrumentsNumber+i;
        if(remove) {
            boxesArray[index].classList.remove('nowPlaying');
            boxesArray[index].querySelector('.inner').classList.remove('bigger');
            var aaa = document.querySelectorAll('.sound');
            if(grid[id][i] && playing)
                aaa[i].querySelector('div').classList.add('fullBar');
        } else {
            boxesArray[index].classList.toggle('nowPlaying');
            boxesArray[index].querySelector('.inner').classList.add('bigger');
        }
    }
}