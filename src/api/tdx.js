import request from '@/router/axios'
// 取得token
export function getToken() {
  return request({
    url: `https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token`,
    method: 'post',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: {
      grant_type: "client_credentials",
      client_id: "a0963573232-81c07129-2a3b-4444",
      client_secret: "d443b7cf-86c3-438e-8b8b-14dfc66439eb",
    },
  })
}
// 取得鄰近地區資料
export function getNearbyInfo(mode,token, obj) {
  return request({
    url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/${mode}`,
    method: 'get',
    headers: { "Authorization": token },
    params: obj,
  })
}
// 取得資料
export function getTravelInfo(mode, city, token, obj) {
  return request({
    url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/${mode}${city}`,
    method: 'get',
    headers: { "Authorization": token },
    params: obj,
  })
}

// 取得單筆資料
export function getOneDetail(mode, token, obj) {
  return request({
    url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/${mode}`,
    method: 'get',
    headers: { "Authorization": token },
    params: obj,
  })
}