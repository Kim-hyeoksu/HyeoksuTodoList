const formatDate = () => {
  let todayDate = new Date();
  let today = calculateDate(todayDate);

  let yesterdayDate = new Date(Date.now() - 86400000);
  // 86400000 = 24 * 60 * 60 * 1000
  let yesterday = calculateDate(yesterdayDate);

  let dateData = {
    today: today,
    yesterday: yesterday
  }

  return dateData;
}

const calculateDate = (date) => {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();     //0~11 값이 나옴
  let day = (date.getDate()).toString();

  if(month.length < 2) month = `0${month}`;
  if(day.length < 2) day = `0${day}`;

  let finalDate = `${year}${month}${day}`;

  return finalDate;
}
