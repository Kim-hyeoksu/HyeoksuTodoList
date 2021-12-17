function modifyWidget(selectedWidget) {
  addWidget('true', selectedWidget)
}

function addWidget(isModify, selectedWidget) {
  const widgetName = document.querySelector('.modal .modal_body .addWidgetModal article div .widgetText').value;
  const widgetDate = document.querySelector('.modal .modal_body .addWidgetModal article .widgetDate').value;
  const mainDate = () => {
    const today = new Date().getTime();
    const widgetDate = document.querySelector('.modal .modal_body .addWidgetModal article .widgetDate').valueAsNumber;
    let gap = null;
    if (today > widgetDate) {
      gap = Math.floor(((today - widgetDate) / 1000 / 60 / 60 / 24) + 1)    //경과일
    } else {
      gap = Math.ceil((widgetDate - today) / 1000 / 60 / 60 / 24)   //디데이 올림
    }
    return gap
  };
  let widgetDateType = '';
  const widgetDateTypeContent = () => {
    const isDday = document.querySelector('.modal .modal_body form article .checkTypeContainer #dDay').checked;
    if (isDday) {
      widgetDateType = 'dDay';
      return (`
      <div class="widgetDateText">
        <span>D-</span>
        <span class="mainDate">${mainDate()}</span>
      </div>
      `)
    } else {
      widgetDateType = 'days';
      return (`
      <div class="widgetDateText"> 
        <span class="mainDate">${mainDate()}</span>
        <span>일째</span>
      </div>
      `)
    }
  }
  let widgetList = [];
  if (localStorage.getItem('widgetList')) {
    widgetList = JSON.parse(localStorage.getItem('widgetList'));
    if (widgetList.length >= 8) {
      alert('위젯리스트가 다 찼습니다.')
      return
    }
  }

  const createNextId = (widgetList) => {
    if(widgetList.length > 0) {
      let numOfArrElements = widgetList.length
      let lastIdx = Number(numOfArrElements) - 1
      let nextID = Number(widgetList[lastIdx].id) + 1;

      return nextID;
    } else {
      return 0;
    }
  }
  const newWidget = {
    content: `
    <li class="widget" id="${createNextId(widgetList)}" onclick="toggleModal('modifyWidget', event)">
      <span>${widgetName}</span>
      <span id="eventDate">${widgetDate}</span>
      ${widgetDateTypeContent()}
    </li>
    `,
    id: createNextId(widgetList),
    widgetName: widgetName,
    widgetDate: widgetDate,
    widgetDateType: widgetDateType,
    widgetCalculatedDate: mainDate()
  }

  if (isModify === 'true') {
    for (let i = 0; i < widgetList.length; i++) {
      if (widgetList[i].id === selectedWidget.id) {
        widgetList[i] = { ...newWidget }
        break;
      }
    }
  } else {
    widgetList.push(newWidget);
  }

  localStorage.setItem('widgetList', JSON.stringify(widgetList))
  showWidgetList();
  toggleModal();
}

function showWidgetList() {
  let widgetContainer = document.querySelector('.widgetContainer');
  widgetContainer.innerHTML = `
    <button onClick="resetWidgetList()">초기화</button>
    <li class="widget" onclick="toggleModal('widget')">
      <span class="addWidget">+</span>
    </li>
  `;
  const parsedWidgetList = JSON.parse(localStorage.getItem('widgetList'))
  if (parsedWidgetList === null) {
    return
  }
  for (let i = 0; i < parsedWidgetList.length; i++) {
    widgetContainer.innerHTML += `${parsedWidgetList[i].content}`;
  }
}

function deleteWidget(id) {
  const parsedWidgetList = JSON.parse(localStorage.getItem('widgetList'));
  for (let i = 0; i < parsedWidgetList.length; i++) {
    if (parsedWidgetList[i].id === parseInt(id, 10)) {
      parsedWidgetList.splice(i, 1);
      i--;
    }
  }
  localStorage.removeItem('widgetList');
  localStorage.setItem('widgetList', JSON.stringify(parsedWidgetList))
  showWidgetList();
  toggleModal();
}

function resetWidgetList() {
  localStorage.removeItem('widgetList');
  showWidgetList()
  alert('위젯이 초기화되었습니다.')
}

function reloadWidgetTime() {
  const today = new Date().getTime();
  const widgetList = document.querySelector('body .widgetContainer')
  let gap = null;
  for(let i = 2; i < widgetList.children.length; i++) {
    let widgetDate = Date.parse(widgetList.children[i].children[1].innerHTML);    //문자열을 밀리초 값으로 변환
    let mainDate;
    if (today > widgetDate) {
      gap = Math.floor(((today - widgetDate) / 1000 / 60 / 60 / 24) + 1)    //경과일
      mainDate = widgetList.children[i].children[2].firstElementChild
    } else {
      gap = Math.ceil((widgetDate - today) / 1000 / 60 / 60 / 24)   //디데이 올림
      mainDate = widgetList.children[i].children[2].lastElementChild
    }
    mainDate.innerHTML = `${gap}`
  }
}

export {modifyWidget, addWidget, showWidgetList, deleteWidget, resetWidgetList, reloadWidgetTime}