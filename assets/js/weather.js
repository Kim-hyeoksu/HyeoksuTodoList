export function requestWeather() {
  const fineDust = ['getUltraSrtNcst', 'getUltraSrtFcst', 'getVilageFcst', 'getFcstVersion'];
  const encodingKey = 'mRGjg3%2F2UUHbsxo6%2F0hRd0yGtU%2BpjfH9HP%2FnfwA8nUWyBwbRChPmV85e9wPdnhuChn3lUqWxgE4iYvrHxn4VsA%3D%3D'
  const decodingKey = 'mRGjg3/2UUHbsxo6/0hRd0yGtU+pjfH9HP/nfwA8nUWyBwbRChPmV85e9wPdnhuChn3lUqWxgE4iYvrHxn4VsA=='
  for (const item of fineDust) {
    const request = axios({
      method: 'GET',
      url: `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${item}?serviceKey=${encodingKey}&numOfRows=10&pageNo=1&ftype=ODAM&basedatetime=202106280800`
    }).then(response => {
      console.log(response)
      // let weatherData;
      // for (let key in response.data) weatherData = response.data[key];
      // console.log('weatherData: ', weatherData)
      // makeWeatherData(item, response.data)
    })
    // .then(()=>renderWeatherData())
  }
}