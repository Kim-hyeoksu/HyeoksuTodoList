function requestDust() {
  const fineDust = ['PM10', 'PM25', 'NO2'];
  for (const item of fineDust) {
    const request = axios({
      method: 'GET',
      url: `http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureLIst?itemCode=${item}&dataGubun=HOUR&pageNo=1&numOfRows=100&returnType=json&serviceKey=mRGjg3%2F2UUHbsxo6%2F0hRd0yGtU%2BpjfH9HP%2FnfwA8nUWyBwbRChPmV85e9wPdnhuChn3lUqWxgE4iYvrHxn4VsA%3D%3D`
    }).then(response => {
      makeDustData(item, response.data)
    }).then(()=>renderDustData())
  }
}


const makeDustData = (item, data) => {
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
  dustDataText.innerHTML = `${dust.dateTime}`;
  dustDataImage.innerHTML = `<img src="${selectEmoticon()}" width="50%" height="auto">`
  contentViewContainer.innerHTML = `
    <div class="contentView">
      <span class="dustTitle">미세먼지</span>
      <span class="dustLevel">${dust.fineDustLevel}</span>
      <span class="dust">${dust.fineDust}μg/m3</span>
    </div>
    <div class="contentView">
      <span class="dustTitle">초미세먼지</span>
      <span class="dustLevel">${dust.ultraFineDustLevel}</span>
      <span class="dust">${dust.ultraFineDust}μg/m3</span>
    </div>
    <div class="contentView">
      <span class="dustTitle">이산화질소</span>
      <span class="dustLevel">${dust.nitrogenDioxideLevel}</span>
      <span class="dust">${dust.nitrogenDioxide}ppm</span>
    </div>
    `
    for(let i = 0; i<3; i++) {
      let dustLevel = contentViewContainer.children[i].children[1];
      if(dustLevel.value === '좋음' || dustLevel.value === '보통') {
        if(dustLevel.classList.contains('blueText')) {
          dustLevel.classList.remove('blueText')
        }
        dustLevel.classList.add('redText')
      } else {
        if(dustLevel.classList.contains('redText')) {
          dustLevel.classList.remove('redText')
        }
        dustLevel.classList.add('blueText')
      }
    }
}

const selectEmoticon = () => {
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

export {requestDust, makeDustData, renderDustData, selectEmoticon}