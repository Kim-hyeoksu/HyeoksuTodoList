export function getUserName() {
  const userName = document.querySelector('main .todoListContainer .userNameInput');
  if(localStorage.getItem('userName')) {
    userName.outerHTML = `<span class="userName" onClick="deleteUserName()">${JSON.parse(localStorage.getItem('userName'))}</span>`
  }
}

export function setUserName() {
  const userName = document.querySelector('main .todoListContainer .userNameInput');
  if(userName.value != "") {
    localStorage.setItem('userName', JSON.stringify(userName.value))
  }
  
  getUserName();
}

export function deleteUserName() {
  const userName = document.querySelector('main .todoListContainer .userName')
  localStorage.removeItem('userName')
  userName.outerHTML = `<input type="text" class="userNameInput"
  onkeyup="if(window.event.keyCode==13){setUserName()}"></input>`
}