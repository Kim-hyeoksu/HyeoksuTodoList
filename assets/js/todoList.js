export function addTodoList() {
  let item = document.querySelector('main .todoListContainer .todoInput').value;
  if (localStorage.getItem('itemList')) {
    itemList = JSON.parse(localStorage.getItem('itemList'));
  }
  if (item != null && !itemList.includes(item)) {

    itemList.unshift(item);
    localStorage.setItem('itemList', JSON.stringify(itemList))
  } else {
    alert('중복되거나 없는 값이 입력되었습니다.')
  }

  showList()
  item = ''
}

export function clearTodo(e) {
  e.target.classList.toggle('clear')
}

export function showList() {
  todoList.innerHTML = '';
  const parsedItemList = JSON.parse(localStorage.getItem('itemList'))
  if(parsedItemList === null) {
    return
  }
  for (let i = 0; i < parsedItemList.length; i++) {
    todoList.innerHTML += `<li onClick="clearTodo(event)">${parsedItemList[i]}</li>`;
  }
}

export function resetList() {
  todoList.innerHTML = '';
  localStorage.removeItem('itemList');
  toggleModal()
}
