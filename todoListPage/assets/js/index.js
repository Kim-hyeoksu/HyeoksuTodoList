let nowDate = document.querySelector('main .date h1');
const todoList = document.querySelector('main .todoListContainer .todoList');

let itemList = [];

function getUserName() {
  const userName = document.querySelector('main .todoListContainer .userNameInput');
  if (localStorage.getItem('userName')) {
    userName.outerHTML = `<span class="userName" onClick="deleteUserName()">${JSON.parse(localStorage.getItem('userName'))}</span>`
  }
}

function setUserName() {
  const userName = document.querySelector('main .todoListContainer .userNameInput');
  if (userName.value != "") {
    localStorage.setItem('userName', JSON.stringify(userName.value))
  }

  getUserName();
}

function deleteUserName() {
  const userName = document.querySelector('main .todoListContainer .userName')
  localStorage.removeItem('userName')
  userName.outerHTML = `<input type="text" class="userNameInput"
  onkeyup="if(window.event.keyCode==13){setUserName()}"></input>`
}

function addTodoList() {
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

function clearTodo(e) {
  e.target.classList.toggle('clear')
}

function showList() {
  todoList.innerHTML = '';
  const parsedItemList = JSON.parse(localStorage.getItem('itemList'))
  if(parsedItemList === null) {
    return
  }
  for (let i = 0; i < parsedItemList.length; i++) {
    todoList.innerHTML += `<li onClick="clearTodo(event)">${parsedItemList[i]}</li>`;
  }
}

function resetList() {
  todoList.innerHTML = '';
  localStorage.removeItem('itemList');
  toggleModal()
}

function toggleModal(item, e) {
  const modal = document.querySelector('body .modal');
  const modalText = document.querySelector('body .modal .modal_body form');
  const modalBody = document.querySelector('body .modal .modal_body')
  modalBody.style.width = '300px'
  const positiveBtn = document.querySelector('body .modal .modal_body .btnContainer .positiveBtn')
  positiveBtn.innerHTML = '예'
  positiveBtn.style.display = 'inline-block'
  const negativeBtn = document.querySelector('body .modal .modal_body .btnContainer .negativeBtn')
  negativeBtn.innerHTML = '아니오'
  const deleteBtn = document.querySelector('.modal .modal_body .btnContainer .deleteBtn')
  let selectedWidget = {
    id: '',
    widgetName: '',
    widgetDate: '',
    widgetDateType: '',
    widgetCalculatedDate: ''
  }
  if (item === 'reset') {
    modalBody.style.height = '150px'
    modalText.innerHTML = '<p>리스트를 초기화 하시겠습니까?</p>'
    deleteBtn.classList.remove('show')
    positiveBtn.setAttribute('onClick', 'resetList()')
  } else if (item === 'widget') {
    modalBody.style.height = '250px'
    modalText.outerHTML = `
    <form class="addWidgetModal">
      <p>위젯 만들기</p>
      <article>
        <div>디데이 이름 <input type="text" class="widgetText"></input></div>
        <input class="widgetDate" type="date"></input>
        <section class="howToCount">
          <span>계산방법</span>
          <div class="checkTypeContainer">
          <!--radio에서 name이 같아야(같은항목으로 지정) 중복 불가능이 가능-->
            <label><input id="dDay" type="radio" name="count" value="dDay">디데이</label>
            <label><input id="days" type="radio" name="count" value="days">경과일</label>
          </div>
        </section>
      </article>
    </form>
    `
    deleteBtn.classList.remove('show')
    positiveBtn.setAttribute('onClick', 'addWidget()')
  } else if (item === 'modifyWidget') {
    let parsedWidgetList = JSON.parse(localStorage.getItem('widgetList'));
    selectedWidget.id = Number(e.currentTarget.id)

    for (let i = 0; i < parsedWidgetList.length; i++) {
      if (parsedWidgetList[i].id === selectedWidget.id) {
        selectedWidget.widgetName = parsedWidgetList[i].widgetName
        selectedWidget.widgetDate = parsedWidgetList[i].widgetDate
        selectedWidget.widgetDateType = parsedWidgetList[i].widgetDateType
        selectedWidget.widgetCalculatedDate = parsedWidgetList[i].widgetCalculatedDate
        break
      }
    }

    modalBody.style.height = '250px'
    modalText.outerHTML = `
    <form class="addWidgetModal">
      <p>위젯 수정</p>
      <article>
        <div>디데이 이름 <input type="text" class="widgetText"></input></div>
        <input class="widgetDate" type="date"></input>
        <section class="howToCount">
          <span>계산방법</span>
          <div class="checkTypeContainer">
          <!--radio에서 name이 같아야(같은항목으로 지정) 중복 불가능이 가능-->
            <label><input id="dDay" type="radio" name="count" value="dDay">디데이</label>
            <label><input id="days" type="radio" name="count" value="days">경과일</label>
          </div>
        </section>
      </article>
    </form>
    `
    deleteBtn.classList.add('show')
    deleteBtn.addEventListener('click', (e)=> {
      deleteWidget(selectedWidget.id)
      e.preventDefault()
    })
    
    document.querySelector('body .modal .modal_body form article div .widgetText').setAttribute('value', `${selectedWidget.widgetName}`);
    document.querySelector('body .modal .modal_body form article .widgetDate').setAttribute('value', selectedWidget.widgetDate);

    const dDay = document.querySelector('body .modal .modal_body form article .howToCount .checkTypeContainer #dDay');
    const days = document.querySelector('body .modal .modal_body form article .howToCount .checkTypeContainer #days');
    if (selectedWidget.widgetDateType === 'dDay') {
      dDay.checked = true
      days.checked = false
    } else {
      dDay.checked = false
      days.checked = true
    }

    positiveBtn.setAttribute('onClick', false)
    positiveBtn.addEventListener('click', (e)=>{
      modifyWidget(selectedWidget);
      e.preventDefault();
    })
  } else if (item === 'stopWatch') {
    modalBody.style.height = '250px'
    modalText.innerHTML = ''
    const stopWatch = document.createElement('div')
    stopWatch.classList.add('stopWatch')

    const time = document.createElement('p')
    time.classList.add('time')
    time.innerHTML = '00:00:00'

    const btnContainer = document.createElement('div')
    btnContainer.classList.add('btnContainer')
    btnContainer.innerHTML = `
    <i class="fa-solid fa-play" onclick="stopWatch('start')"></i>
    <i class="fa-solid fa-pause" onclick="stopWatch('pause')"></i>
    <i class="fa-solid fa-stop" onclick="stopWatch('reset')"></i>
    `

    stopWatch.appendChild(time)
    modalText.appendChild(stopWatch)
    stopWatch.appendChild(btnContainer)

    positiveBtn.style.display = 'none'
    negativeBtn.innerHTML = '확인'

  } else if (item === 'memo') {
    deleteBtn.classList.remove('show')
    modalText.innerHTML = '';
    modalBody.style.height = '500px'
    modalBody.style.width = '90%'
  }
  modal.classList.toggle('show')
}

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





function getTime(type) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const seconds = date.getSeconds();

  nowDate.innerHTML = `
  ${year}년
  ${month < 10 ? `0${month}` : month}월
  ${day < 10 ? `0${day}` : day}일
  ${hours < 10 ? `0${hours}` : hours
    }:${minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}
  `
}
let timer = undefined;
let stop = true;
let minutes = 0;
let seconds = 0;
let ms = 0;

function stopWatch(type) {
  const time = document.querySelector('.stopWatch .time')
  const startStopWatch = () => {
    ms++;
    if(ms === 100) {
      seconds++
      ms=0
    }
    if(seconds === 60) {
      minutes++
      seconds = 0;
    }
    time.innerHTML = `
    ${minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds
    }:${ms < 10 ? `0${ms}` : ms}
    `

  }

  if(type === 'start') {
    if(!stop) {
      return
    }
    stop = false
  } else if (type === 'pause') {
    stop = true
  } else {
    stop = true;
    minutes = 0
    seconds = 0
    ms = 0
    time.innerHTML = `00:00:00`
  }

  if(stop === false) {
    timer = setInterval(()=>startStopWatch(), 10)
  } else {
    clearInterval(timer)
  }
}

function requestCovid() {
  let today = formatDate().today
  let yesterday = formatDate().yesterday
  const request = axios({
    method: 'GET',
    url: `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=mRGjg3%2F2UUHbsxo6%2F0hRd0yGtU%2BpjfH9HP%2FnfwA8nUWyBwbRChPmV85e9wPdnhuChn3lUqWxgE4iYvrHxn4VsA%3D%3D&pageNo=1&numOfRows=10&startCreateDt=${yesterday}&endCreateDt=${today}`,
  }).then(response=>{
    makeCovidData(response.data)
  })
}

function requestDust() {
  const fineDust = ['PM10', 'PM25', 'NO2'];
    for (const item of fineDust) {
      const request = axios({
        method: 'GET',
        url: `http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureLIst?itemCode=${item}&dataGubun=HOUR&pageNo=1&numOfRows=100&returnType=json&serviceKey=mRGjg3%2F2UUHbsxo6%2F0hRd0yGtU%2BpjfH9HP%2FnfwA8nUWyBwbRChPmV85e9wPdnhuChn3lUqWxgE4iYvrHxn4VsA%3D%3D`
      }).then(response => {
        makeDustData(item, response.data)
      })
    }
    renderDustData()
}

let dust = {
  place: '서울',
  dateTime: '',
  fineDust: '',                  //미세먼지
  fineDustLevel: '',            //미세먼지 단계
  ultraFineDust: '',             //초미세먼지
  ultraFineDustLevel: '',       //초미세먼지 단계  
  nitrogenDioxide: '',           //이산화질소
  nitrogenDioxideLevel: ''      //이산화질소 단계
}
makeDustData = (item, data) => {
  let dustData;
  let value, level;
  for (let key in data) dustData = data[key];
  console.log('dustData: ', dustData)
  
  value = dustData.body.items[0].seoul;

  if(item === 'PM10') {
    if (value <= 30) {
      level = '좋음';
    } else if (value > 30 && value <= 50) {
      level = '보통';
    } else if (value > 50 && value <= 100) {
      level = '나쁨';
    } else if (value > 101) {
      level = '매우나쁨';
    }

    dust= {
      ...dust,
      dateTime: dustData.body.items[0].dataTime,
      fineDust: value,
      fineDustLevel: level
    }

  } else if (item === 'PM25') {
    if (value <= 15) {
      level = '좋음';
    } else if (value > 15 && value <= 25) {
      level = '보통';
    } else if (value > 25 && value <= 50) {
      level = '나쁨';
    } else if (value > 51) {
      level = '매우나쁨';
    }

    dust= {
      ...dust,
      ultraFineDust: value,
      ultraFineDustLevel: level
    }

  } else if (item === 'NO2') {
    if (value <= 0.03) {
      level = '좋음';
    } else if (value > 0.03 && value <= 0.06) {
      level = '보통';
    } else if (value > 0.06 && value <= 0.2) {
      level = '나쁨';
    } else if (value > 0.2) {
      level = '매우나쁨';
    }

    dust= {
      ...dust,
      nitrogenDioxide: value,
      nitrogenDioxideLevel: level
    }
  }
}

function renderDustData() {
  const contentViewContainer = document.querySelector('.rightWidgetContainer .contentViewContainer')
  const dustDataText = document.querySelector('.rightWidgetContainer .dustDataContainer .dustDataText')
  const dustDataImage = document.querySelector('.rightWidgetContainer .dustDataContainer img')
  console.log(contentViewContainer, dustDataText)
  dustDataText.innerHTML = `${dust.fineDustLevel}`;
  dustDataImage.innerHTML = `<img src="${selectEmoticon()}" width="50%" height="auto">`
  contentViewContainer.innerHTML = `
    <div class="contentView">
      <span>미세먼지</span>
      <span class="fineDustLevel">${dust.fineDustLevel}</span>
      <span>${dust.fineDust}μg/m3</span>
    </div>
    <div class="contentView">
      <span>초미세먼지</span>
      <span>${dust.ultraFineDustLevel}</span>
      <span>${dust.ultraFineDust}μg/m3</span>
    </div>
    <div class="contentView">
      <span>이산화질소</span>
      <span>${dust.nitrogenDioxideLevel}</span>
      <span>${dust.nitrogenDioxide}ppm</span>
    </div>
    `
}

makeCovidData = (data) => {
  let covidData;
  console.log('covidData: ', data)
  for (let key in data) {
    covidData = data[key]
  }

  let prevData = covidData.body.items.item[1];
  let currData = covidData.body.items.item[0];

  // console.log('prevData: ', prevData);
  // console.log('currData: ', currData);

  let covidCopy = this.state.covid;
  covidCopy.dateTime = currData.createDt;
  covidCopy.confirmed = this.addComma(currData.decideCnt);   // 확진환자
  covidCopy.released = this.addComma(currData.clearCnt);     // 격리해제
  covidCopy.deceased = this.addComma(currData.deathCnt);     //사망자
  covidCopy.inProgress = this.addComma(currData.examCnt);    //검사진행

  covidCopy.confirmedDailyChange = currData.decideCnt - prevData.decideCnt;   // 확진환자 변화량
  covidCopy.releasedDailyChange = currData.clearCnt - prevData.clearCnt;      // 격리해제 변화량
  covidCopy.deceasedDailyChange = currData.deathCnt - prevData.deathCnt;      // 사망자 변화량
  covidCopy.inProgressDailyChange = currData.examCnt - prevData.examCnt;      // 검사진행 변화량
}

addComma = (num) => {
  let regExp = /\B(?=(\d{3})+(?!\d))/g;     //정규 표현식
  return num.toString().replace(regExp, ',');
}

formatDate = () => {
  let todayDate = new Date();
  let today = this.calculateDate(todayDate);

  let yesterdayDate = new Date(Date.now() - 86400000);
  // 86400000 = 24 * 60 * 60 * 1000
  let yesterday = this.calculateDate(yesterdayDate);

  let dateData = {
    today: today,
    yesterday: yesterday
  }

  return dateData;
}

calculateDate = (date) => {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();     //0~11 값이 나옴
  let day = (date.getDate()).toString();

  if(month.length < 2) month = `0${month}`;
  if(day.length < 2) day = `0${day}`;

  let finalDate = `${year}${month}${day}`;

  return finalDate;
}

selectEmoticon = () => {
  const fineDustLevel = dust.fineDustLevel;
  let emoticonPath;

  switch (fineDustLevel) {
    case '좋음':
      emoticonPath = '../../assets/images/very_good.png'
      return emoticonPath
    case '보통':
      emoticonPath = '../../assets/images/good.png'
      return emoticonPath
    case '나쁨':
      emoticonPath = '../../assets/images/bad.png'
      return emoticonPath
    case '매우나쁨':
      emoticonPath = '../../assets/images/very_bad.png'
      return emoticonPath
    default:
      emoticonPath = '../../assets/images/very_good.png'
      return emoticonPath
  }
}

function init() {
  getTime();  //처음에 getTime을 실행하고
  // setInterval(()=>{
  //   getTime()
  //   getNoSmokingTime()
  // }, 1000); //100ms마다 계속 실행하는 것
  setInterval(()=>{
    getTime()
    reloadWidgetTime()
  }, 1000)
  showList();
  showWidgetList();
  getUserName();
  requestDust();
}

init();