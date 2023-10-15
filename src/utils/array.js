/**
* 將array資料隨機取出
* @param {*} arr 要取出的array
* @param {*} count 要返回的數量
*/
export const dataFilter = (arr, count = 4) => {
  let num = count
  if (arr.length < count) num = arr.length
  return new Promise((resolve) => {
    const result = [];
    for (let i = 0; i < num; i++) {
      if (!arr.length) return;
      const idx = Math.floor(Math.random() * arr.length);
      result.push(arr[idx]);
      arr.splice(idx, 1);
    }
    resolve(result);
  });
};
/**
* 將日期格式化
* @param {*} arr 要格式化的array
*/
export const dataRegular = (arr) => {
  return new Promise((resolve) => {
    arr.forEach((item) => {
      if (item.StartTime) item.StartTime = item.StartTime.split("T")[0];
      if (item.EndTime) item.EndTime = item.EndTime.split("T")[0];
      if (item.StartTime === item.EndTime) item.Date = item.EndTime;
    });
    resolve(arr);
  });
};