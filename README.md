# cloudflare-worker-url-shortner

cloudflare-worker-url-shortner 是一个使用 **Cloudflare Workers** 构建的 **无服务器 URL 缩短服务**。它提供了一种简单高效的方式来缩短长 URL 并管理重定向。

## [演示](https://surl.coderxi.com/)

![预览](https://github.com/user-attachments/assets/29038684-2a31-4520-9177-9fdd1a2d675e)

## 特性

- 😀 简单干净的风格
- 🗄️ 使用 Cloudflare KV 进行持久存储
- 🔗 支持自定义短 URL
- 📡 简单的 API 用于创建短链接

## 先决条件
- 🌐 一个 Cloudflare 账户
- 🗄️ 安装 Wrangler 并登录
   ```sh
   npm install -g wrangler
   wrangler login
   ```

## 安装
1. 创建 KV 命名空间
   ![步骤1](https://github.com/user-attachments/assets/64ac30af-b144-4a23-9c19-d3018ce9bb58)
2. 记住 KV 命名空间 ID
   ![步骤2](https://github.com/user-attachments/assets/02ef2c13-6db4-4e4f-aed2-baf4d859a376)
3. 克隆此仓库并使用中文分支
   ```sh
   git clone -b chinese https://github.com/coderxi1/cloudflare-worker-url-shortner
   ```
4. 安装依赖
   ```sh
   pnpm install
   ```
5. 在 `wrangler.jsonc` 中更改 `PASSWORD` 和 KV 命名空间的 `ID`
   ```jsonc
   {
     "vars": {
       "PASSWORD": "<YOUR_PASSWORD>", //自定义你的密码
     },
     "kv_namespaces": [
         {
           "binding": "URLS",
           "id": "<YOUR_KV_NAMESPACE_ID>"  //更改为你的 KV 命名空间 ID
         }
       ]
   }
   ```
6. 部署到 Cloudflare
   ```sh
   pnpm run deploy
   ```

## API 使用

### 创建短 URL

**请求:**
```http
POST /
Content-Type: application/json
{
  "url": "https://coderxi.com/url-shortener-with-cloudflare-worker",
  "password": "<YOUR_PASSWORD>",
  "key": "doc",
  "expireDay": 1
}
```
**响应:**
```json
{
  "key": "doc"
}
```