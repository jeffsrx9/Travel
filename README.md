# 名稱
台灣旅遊景點導覽
![專案封面圖](https://raw.githubusercontent.com/jeffsrx9/resume/main/images/main.png)

> 讓使用者可以根據分類與搜索，找到指定的景點、附近的餐飲、適合的民宿、目前舉辦的活動。

- [線上觀看連結](https://jeffsrx9.github.io/Travel/)

## 功能

- [x] RWD
- [x] 搜索
- [x] Google Map
- [x] 分類列表
...

## 畫面

![範例圖片 1](https://raw.githubusercontent.com/jeffsrx9/resume/main/images/info1.png)
![範例圖片 2](https://raw.githubusercontent.com/jeffsrx9/resume/main/images/info2.png)
![範例圖片 3](https://raw.githubusercontent.com/jeffsrx9/resume/main/images/info3.png)

## 代碼介紹

> 使用 `new Promise` 來處理Function，建立非同步運算程式，確保程式流程不會發生錯誤
```bash
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
```

> 每次調用API都會需要token值，因此使用 `Vuex` 儲存Token，先在初始化時取得token，這樣之後調用時API就不用再次getToken了
```bash
  actions: {
    asyncUpdate(store) {
      return new Promise((resolve, reject) => {
        getToken().then((res) => {
          if (res) {
            store.commit('updateToken', res)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
```
> 使用 `watch` 監聽用戶點擊的分類，來切換主題顏色
```bash
    const setModeColor = (color) => {
      document.documentElement.style.setProperty("--c-main", color);
      const themeColor = document.querySelector('meta[name="theme-color"]');
      themeColor.setAttribute("content", color);
    };
    watch(
      () => mode.value,
      () => setModeColor(modeLib[mode.value].color)
    );
```

> 使用 `window.requestAnimationFrame` 來處理跑馬燈動畫，與 `setTimeout` 不同的是它可以根據螢幕的刷新次數自動調整間隔時間從而優化動畫效率與資源，不過缺點是不兼容IE9及以下的瀏覽器
```bash
  window.onload = function () {
    function test() {
      console.log("requestAnimationFrame ----");
    }
    requestAnimationFrame(test);
  }
```


## 資料夾說明

- api - API放置處
- views - 畫面放置處
- components - 組件放置處
- router - 路由放置處
- store - 共用的資料放置處
- assets - 靜態資源放置處
  - scss - scss 檔案放置處
  - images - 圖片放置處
...

## 使用到的技術&版本

- `Vue` 3.2.39
- `Vue Router` 4.1.5
- `Vuex` 4.0.2
- `Axios` 1.5.0
...

## CI/CD 說明

此專案有使用 `Github Actions`，所以發起 PR 時會自動執行以下動作：

- 安裝相依套件
- 編譯程式碼
- 執行 ESLint 掃描
- 執行測試
...

當專案 `merge` 到 `main` 時會自動執行以下動作：

- 安裝相依套件
- 編譯程式碼
- 執行 ESLint 掃描
- 執行測試
- 部署到 Github Pages
...

## 聯絡我

您可以透過以下方式與我聯絡

- [Line](https://line.me/ti/p/mJROuIB34D)
- [Email](mailto:jeff85510t@gmail.com)