import {getUserName, setUserName, deleteUserName} from './user.js'
import  {addTodoList, clearTodo, showList, resetList} from './todoList.js'
import {modifyWidget, addWidget, showWidgetList, deleteWidget, resetWidgetList, reloadWidgetTime} from './widget.js'
import {requestDust, makeDustData, renderDustData, selectEmoticon} from './dust.js'
import {requestWeather} from './weather.js'
//import 해오는 주소에 .js를 붙이지않으면 404 error 발생

let nowDate = document.querySelector('main .date h1');
const todoList = document.querySelector('main .todoListContainer .todoList');
let itemList = [];
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

//전역변수
//innerHTML로 만든 html 태그 안에 onClick으로 함수를 실행하는 경우이거나,
//모듈에서 불러온 변수나 함수 등을 다른 모듈에서도 사용하기 위해 전역변수화 시켜야함.
window.nowDate = nowDate;
window.todoList = todoList;
window.itemList = itemList;
window.dust = dust;
window.toggleModal = toggleModal
window.stopWatch = stopWatch
window.resetWidgetList = resetWidgetList
window.addWidget = addWidget
window.deleteWidget = deleteWidget
window.showWidgetList = showWidgetList

//이벤트 등록
const userNameInput = document.querySelector('main .todoListContainer .userNameInput')
userNameInput.addEventListener('keyup', (event)=>{
  console.log('userNameInput')
  if(event.keyCode==13){
    setUserName()
  }
})
const todoInput = document.querySelector('main .todoListContainer .todoInput')
todoInput.addEventListener('keyup', (event)=>{
  if(event.keyCode==13){
    addTodoList()
  }
})

const widgetResetBtn = document.querySelector('.widgetContainer .resetBtn');
widgetResetBtn.addEventListener('click', ()=>toggleModal('resetWidget'))

const negativeBtn = document.querySelector('.modal .modal_body .btnContainer .negativeBtn')
negativeBtn.addEventListener('click', toggleModal)

const plusWidget = document.querySelector('.widgetContainer .addWidget')
plusWidget.addEventListener('click', ()=>toggleModal('widget'))

const calendarBtn = document.querySelector('header ul .calendarBtn')
const stopWatchBtn = document.querySelector('header ul .stopWatchBtn')
const memoBtn = document.querySelector('header ul .memoBtn')
stopWatchBtn.addEventListener('click', ()=>toggleModal('stopWatch'))
memoBtn.addEventListener('click', ()=>toggleModal('memo'))

const resetBtn = document.querySelector('.todoListContainer .resetBtn')
resetBtn.addEventListener('click', ()=>toggleModal('resetTodolist'))

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
  if (item === 'resetTodolist') {
    modalBody.style.height = '150px'
    modalText.innerHTML = '<p>리스트를 초기화 하시겠습니까?</p>'
    deleteBtn.classList.remove('show')
    positiveBtn.onclick = resetList
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
    positiveBtn.onclick = addWidget

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
      console.log(selectedWidget.id)
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
    modalBody.style.width = '70%'
    
  } else if (item === 'resetWidget') {
    console.log('resetWidget')
    modalBody.style.height = '150px'
    modalText.innerHTML = '<p>위젯을 초기화 하시겠습니까?</p>'
    deleteBtn.classList.remove('show')
    positiveBtn.onclick = resetWidgetList
  }
  modal.classList.toggle('show')
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


function init() {
  requestDust();
  // requestWeather();
  getTime();  //처음에 getTime을 실행하고
  reloadWidgetTime()
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
}

init();