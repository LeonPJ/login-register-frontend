# login-register-frontend

瓦斯訂單的登入與管理介面。

[![React](https://img.shields.io/badge/React-17-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-4-0170FE?logo=antdesign&logoColor=white)](https://4x.ant.design/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

登入之後可以看當月統計、建立訂單，以及依姓名、電話或地址找出舊單再改、再刪。介面是繁體中文。後端有註冊 API，這個前端沒有註冊頁。

## 功能

- 當月訂單筆數、應收、實收、出貨與回收
- 5／10／16／20／50 公斤各自的出貨筆數
- 姓名、電話、地址為全等比對

## 頁面

| 路徑 | 你會看到 |
|---|---|
| `/` | 登入 |
| `/forgotpassword` | 寄送新密碼 |
| `/home` | 當月統計 |
| `/home/create` | 建立訂單 |
| `/home/list` | 搜尋、編輯、刪除 |
| `/home/account` | 變更密碼 |

## 快速開始

需要 Node.js、npm，以及已經在跑的 [後端](https://github.com/LeonPJ/login-register-backend)。

```bash
git clone https://github.com/LeonPJ/login-register-frontend.git
cd login-register-frontend
cp .env.example .env
npm install
PORT=3001 npm start
```

瀏覽器打開 <http://localhost:3001>。

後端預設聽 `3000`，這個開發伺服器也是。所以上面把前端改到 `3001`，`.env` 裡的 API 仍指向 `http://localhost:3000`。

正式打包：

```bash
npm run build
```

`.env` 不會進版控。沒有這個檔時，請求網址會是空的。

## 環境變數

變數名稱與預設位址在 [`.env.example`](./.env.example)。後端不是 `localhost:3000` 時，改掉主機位址即可。

- 刪除、更新會再接 `/:id`
- 搜尋會再接 `/:type/:value`（`name`、`phone` 或 `address`）
- `REACT_APP_API_CURRENT_PERIOD` 畫面還沒用

## 登入狀態

登入成功後，token 放在 cookie `authToken`，有效 1 天。訂單請求帶 header `auth-token`。Token 被拒或失效時會清掉 cookie 並回到登入頁。

## 相關專案

- [login-register-backend](https://github.com/LeonPJ/login-register-backend)：登入與訂單 API
