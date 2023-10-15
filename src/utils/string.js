/**
* 偵測顯示模式
* @param {*} ID 要偵測的值
* @param {*} en 模式
*/
export const getMode = (ID, en) => {
  const tag = ID.split("_")[0];
  if (tag === "C1") return en ? "ScenicSpot" : "景點";
  if (tag === "C2") return en ? "Activity" : "活動";
  if (tag === "C3") return en ? "Restaurant" : "餐飲";
  if (tag === "C4") return en ? "Hotel" : "旅宿";
};