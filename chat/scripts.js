var currID = 0;
var gradients = ["linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)"];

const arr = './data.json';
const data = [];
fetch(arr).then(blob => blob.json()).then(a => data.push(...a));
console.log(data);

window.onload = function() {
    loadMe();
    loadChat(0);
    appear();
    openChats();
    loadChatList();
}

const input = document.querySelector('.searchFriends');
input.addEventListener('keyup', searchFriends);

function searchFriends() {
    var inputValue = this.value;
    loadChatList(inputValue, true);
}

//Load friends list
function loadChatList(keyword, search = false) {
    $('#chats').children("div").remove();
    var list = document.createElement('div');
    var searched;
    search ? searched = findSearch(keyword, data) : searched = data;
    const html = searched.map((user, index) => {
       return `
        <div onclick="loadChat(${index})">
            <h2>${user.name} ${user.surname[0]}.</h2>
            <h3>${user.messages[user.messages.length-1].time}</h3>
            <p>${user.messages[user.messages.length-1].content.slice(0, 20)}...</p>
        </div>
        `;
    }).join('');
    list.innerHTML = html;
    $('#chats').append(list);
}

function findSearch(input, data) {
  return data.filter(user => {
    const regex = new RegExp(input, 'gi');
    return user.name.match(regex) || user.surname.match(regex)
  });
}

//Load users info
function loadMe() {
    $('.avatar').children().remove();
    $('.infoContainer').children().remove();
    
    //Add avatar
    var avatarContainer = document.createElement("div");
    var placeForAvatar = document.querySelector(".avatar");
    if(!me.avatar) {
        var text = document.createElement("p");
        text.innerHTML = me.name[0].toUpperCase();
        avatarContainer.appendChild(text);
        avatarContainer.style.backgroundImage = gradients[(JSON.users[currID].name.length)%gradients.length];
    } else {
        avatarContainer.innerHTML = "";
        avatarContainer.style.backgroundImage = "url('" + me.avatar + "')";
    }
    placeForAvatar.appendChild(avatarContainer);
    
    //Add name
    var placeForInfo = document.getElementById("me");
    var infoContainer = document.createElement("div");
    infoContainer.className = "infoContainer"; 
    var info = `
        <p class="myName">${me.wholeName}</p>
        <p class="myEmail">${me.email}</p>
    `;
    infoContainer.innerHTML = info;
    placeForInfo.insertBefore(infoContainer, document.getElementsByClassName("options")[0]);
}

//Load bubbles
function openChats() {
    var id = currID;
    var placeForAvatar = document.getElementById("openChats");
    $('#openChats').children().remove();
    var start = 4;
    if(JSON.users.length-1<4) start = JSON.users.length-1;
    for(var i=start; i>=0; --i) {
        currID = i;
        var avatarContainer = document.createElement("div");
        createAvatar("openChatAvatar", avatarContainer, placeForAvatar, false);
        var newBubble = document.getElementsByClassName("openChatAvatar");
        newBubble[0].setAttribute("onclick", "loadChat(" + i + ")");
    }
    currID = id;
}

//Load chat with friend
function loadChat(id) {
    currID = id;
    
    //Create avatar for header
    var avatarContainer = document.createElement("div");
    var placeForAvatar = document.getElementsByClassName("chatHeader");
    createAvatar("chatAvatar", avatarContainer, placeForAvatar, true);
    
    //Put users info in header and delete previous messages
    $(".chatName").children("h1").html(JSON.users[id].name + " " + JSON.users[id].surname);
    $(".chatName").children("h2").html(JSON.users[id].desc);
    $("#chatMain").children().remove();
    
    loadMessages();
}

//Create avatar function
function createAvatar(className, container, place, remove) {
    //Remove previous avatars
    if(remove) {
        $("." + className).remove();
    }
    
    if(!JSON.users[currID].avatar) {
        var text = document.createElement("p");
        text.innerHTML = JSON.users[currID].name[0].toUpperCase();
        container.appendChild(text);
        container.style.backgroundImage = gradients[(JSON.users[currID].name.length)%gradients.length];
    } else {
        container.innerHTML = "";
        container.style.backgroundImage = "url('" + JSON.users[currID].avatar + "')";
    }
    
    container.className = className;
    $(place).prepend(container);
}

//Load messages for chat
function loadMessages() {
    var messages = JSON.users[currID].messages;
    
    //Load max of 10 messages
    var start = 0;
    if(messages.length>=10){
        start = messages.length-10;
    }
    
    //Load messages
    for(var i=start; i<messages.length; ++i) {
        var newMessageContainer = document.createElement("div");
        var newMessage = document.createElement("p");
        
        if(messages[i].author === me.wholeName) {
            newMessageContainer.style.textAlign = "right";
        } else {
            var avatarContainer = document.createElement("div");
            createAvatar("textAvatar",avatarContainer,newMessageContainer,false);
        }
        
        var newMessageTime = document.createElement("h5");
        newMessageTime.innerHTML = messages[i].date + " " + messages[i].time;
        newMessage.innerHTML = messages[i].content;
        newMessageContainer.appendChild(newMessage);
        newMessageContainer.appendChild(newMessageTime);
        $("#chatMain").append(newMessageContainer);
    }
    
    //Scroll to bottom
    var chatHeight = document.getElementById("chatMain");
    chatHeight.scrollTop = chatHeight.scrollHeight;
}

//Send on Enter
$("#input").keypress((e) => {
    if(e.keyCode == 13) {
        send();
    }
});

/* ----------------- */
//                   // 
//  Some animations  //
//                   //
/* ----------------- */

function appear() {
    setTimeout(function() {
        $('#wholeChat').addClass('appear');
    }, 500);
}

$("#openSettings").click(function() {
    $('#settings').toggleClass('closeSettings');
});

//Toggle users info and friends
$("#toggleMenu").click(toggleMenu);

//Minimalize users info and friends
$("#minimalize").click(minimalize);

function toggleMenu() {
    if($('.smallMainBox').hasClass('disappear')) {
        minimalize();
    }
    $(".smallMainbox").toggleClass("hide"); 
    $("#wholeChat").toggleClass("move"); 
    $('#openChats').toggleClass("hide");
}

function minimalize() {
    if(!$(".smallMainbox").hasClass("hide")) {
        toggleMenu();
    }
    $("#mainChat").toggleClass("minimalize"); 
    $("#wholeChat").toggleClass("down");
    var timeout = 0;
    var openTimeout = 100;
    if($('.smallMainBox').hasClass('disappear')) {
        timeout = 700;
        openTimeout = 0;
    }
    setTimeout(function() { 
        $(".smallMainBox").toggleClass("disappear");
        setTimeout(function() { $("#openChats").toggleClass("hide"); }, Math.abs(openTimeout-100));
        setTimeout(function() { $("#openChats").toggleClass("disappear"); }, openTimeout);
    }, timeout);
}












//TMP
function send() {
    var input = document.getElementById("input");
    if(input.value) {
        var date = new Date();
        var element = ["content", "date", "time", "author"];
        element.content = input.value;
        element.date = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
        element.time = date.getHours() + ":" + date.getMinutes();
        element.author = me.wholeName;
        var newMessageContainer = document.createElement("div");
        var newMessage = document.createElement("p");
        if(element.author === me.wholeName) {
            newMessageContainer.style.textAlign = "right";
        }
        var newMessageTime = document.createElement("h5");
        newMessageTime.innerHTML = element.date + " " + element.time;
        newMessage.innerHTML = element.content;
        newMessageContainer.appendChild(newMessage);
        newMessageContainer.appendChild(newMessageTime);
        $("#chatMain").append(newMessageContainer);
        JSON.users[currID].messages.push(element);
        me.avatar = input.value;
        input.value = "";
    }
    var objDiv = document.getElementById("chatMain");
    objDiv.scrollTop = objDiv.scrollHeight;
    loadChatList();
}



//Send on Enter
$("#changeLogo").keypress(function(e) {
    if(e.keyCode == 13) {
        me.avatar = document.getElementById('changeLogo').value;
        JSON.users[0].avatar = document.getElementById('changeLogo').value;
        loadMe();
        loadChat(currID);
        openChats();
    }
});
//Send on Enter
$("#changeName").keypress(function(e) {
    if(e.keyCode == 13) {
        me.wholeName = document.getElementById('changeName').value;
        for(var i=0; i < JSON.users[0].messages.length; ++i) {
            JSON.users[0].messages[i].author = document.getElementById('changeName').value;
        }
        var namee = document.getElementById('changeName').value;
        var name = "";
        var surname = "";
        var i;
        for(i=0; namee[i] != " " && namee[i]; ++i) {
             name += namee[i];  
        }
        me.name = JSON.users[0].name = name;
        for(++i;namee[i];++i) {
            surname += namee[i];
        }
        me.surname = JSON.users[0].surname = surname;
        loadMe();
        loadChat(currID);
    }
});
//Send on Enter
$("#changeEmail").keypress(function(e) {
    if(e.keyCode == 13) {
        me.email = document.getElementById('changeEmail').value;
        loadMe();
    }
});
//Send on Enter
$("#changeDesc").keypress(function(e) {
    if(e.keyCode == 13) {
        JSON.users[currID].desc = document.getElementById('changeDesc').value;
        loadChat(currID);
    }
});

$("#getMessage").keypress(function(e) {
    if(e.keyCode == 13) {
        var input = document.getElementById("getMessage");
        if(input.value) {
            var date = new Date();
            var element = ["content", "date", "time", "author"];
            element.content = input.value;
            element.date = date.getDate() + "." + date.getMonth()+1 + "." + date.getFullYear();
            element.time = date.getHours() + ":" + date.getMinutes();
            element.author = "Mikołaj Makuch";
            var newMessageContainer = document.createElement("div");
            var newMessage = document.createElement("p");
            var newMessageTime = document.createElement("h5");
            newMessageTime.innerHTML = element.date + " " + element.time;
            newMessage.innerHTML = element.content;
            newMessageContainer.appendChild(newMessage);
            newMessageContainer.appendChild(newMessageTime);
            $("#chatMain").append(newMessageContainer);
            JSON.users[currID].messages.push(element);
            me.avatar = input.value;
            input.value = "";
        }
        loadChat(currID);
        loadChatList();
        var audio = document.querySelector("audio");
        audio.currentTime = 0;
        audio.play();
    }
});