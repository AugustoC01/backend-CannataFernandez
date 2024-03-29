var io = io();

var sender = "";
var receiver = "";
var users = [];

io.on("show-user", (usersData) => {
  let usersList = "";
  usersData.forEach((user) => {
    usersList +=
      "<li><button onclick=onUserSelected(this.innerHTML)>" +
      user +
      "</button></li>";
  });
  document.getElementById("usersList").innerHTML = usersList;
});

//EL ADMIN RECIBE LOS MENSAJES DEL USUARIO QUE SELECCIONA
io.on("chat-data", (messages) => {
  let msgList = "";
  messages.forEach((msg) => {
    if (msg.type == "sistema") {
      msgList += `<li>Admin dice: ${msg.message} </li>`;
    } else {
      msgList += `<li>${msg.email} dice: ${msg.message}</li>`;
    }
  });
  document.getElementById("messages").innerHTML = msgList;
});

io.on("new-msg", (msgData) => {
  let msgList = "";
  if (msgData.type == "usuario") {
    if (msgData.email == receiver) {
      msgList += `<li>${msgData.email} dice: ${msgData.msg}</li>`;
    }
  } else {
    msgList += `<li>Admin dice: ${msgData.msg}</li>`;
  }
  const messages = document.getElementById("messages").outerHTML;
  document.getElementById("messages").innerHTML = msgList + messages;
});

function newChat() {
  const email = document.getElementById("email").value;
  const admin = document.getElementById("admin").value;
  io.emit("user-connected", { email, admin });
  sender = email;
  return false;
}

//SELECCIONA UN USUARIO Y PIDE AL SERVER LA LISTA DE MENSAJES
function onUserSelected(email) {
  const adminEmail = document.getElementById("email").value;
  receiver = email;
  io.emit("retrieve-chats", { email, adminEmail });
}

function sendMsg() {
  const admin = document.getElementById("admin").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  if (message == "") return false;
  if (admin == "true" && receiver == "") return false;
  io.emit("send-msg", { sender, receiver, message, admin });
  let msgList = "";
  if (admin == "true") {
    msgList += `<li>Admin dice: ${message}</li>`;
  } else {
    msgList += `<li>${email} dice: ${message}</li>`;
  }
  const messages = document.getElementById("messages").outerHTML;
  document.getElementById("messages").innerHTML = msgList + messages;
  //PREVENT DEFAULT -- NO RECARGA LA PAGINA
  return false;
}

//MUESTRA EL CHAT Y CREA RELACION ENTRE SOCKET.ID Y EMAIL EN SERVER
function showChat() {
  const form = document.getElementById("msg-form");
  form.style.visibility = "visible";
}
