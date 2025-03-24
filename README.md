[**简体中文**](https://github.com/coderxi1/cloudflare-worker-url-shortner/blob/lite/README.zh.md)

# ![](/public/favicon.ico) cloudflare-worker-url-shortner

This is a **lightweight version** that removes the **navigation, login functionality, proxy mode, and URL management page**. It is implemented using native HTML, achieving an initial response time as fast as **100ms**. 

> [!IMPORTANT]
> If you need more comprehensive features, please refer to the [**master branch**](https://github.com/coderxi1/cloudflare-worker-url-shortner).

## [Demo](https://surl.coderxi.com/)

![preview](https://github.com/user-attachments/assets/29038684-2a31-4520-9177-9fdd1a2d675e)

## Features

- 😀 Simple and clean style
- 🗄️ Uses Cloudflare KV for persistent storage
- 🔗 Custom short URLs support
- 📡 Simple API for creating short links

## Prerequisites
- 🌐 A Cloudflare account
- 🗄️ Install Wrangler and login
   ```sh
   npm install -g wrangler
   wrangler login
   ```
  

## Installation
1. Create KV namespace
   ![step1](https://github.com/user-attachments/assets/64ac30af-b144-4a23-9c19-d3018ce9bb58)
2. Remember KV namespace ID
   ![step2](https://github.com/user-attachments/assets/02ef2c13-6db4-4e4f-aed2-baf4d859a376)
3. Clone this repo and use lite branch
   ```sh
   git clone -b lite https://github.com/coderxi1/cloudflare-worker-url-shortner
   ```
4. Install dependencies
   ```sh
   pnpm install
   ```
5. Change `PASSWORD` and  KV namespace 's `ID` in `wrangler.jsonc`
   ```jsonc
   {
     "vars": {
       "PASSWORD": "<YOUR_PASSWORD>", //custom your password
     },
     "kv_namespaces": [
         {
           "binding": "URLS",
           "id": "<YOUR_KV_NAMESPACE_ID>"  //change to your KV namespace ID
         }
       ]
   }
   ```
6. Deploy to cloudflare
   ```sh
   pnpm run deploy
   ```

## Environment variables

| Key               | Default Value     | Description |
|------------------|-----------------|-------------|
| `PASSWORD`       | `<YOUR_PASSWORD>` | The password for authentication. |
| `PASSWORD_REQUIRE` | `true`          | If set to `true`, password **must** be entered to use all features. |
| `HOST_WHITELIST`  | `["example.com", "coderxi.com"]` | A list of allowed hostnames. Only requests from these domains are accepted **unless a valid password is provided**. |
| `KEY_MIN_LENGTH`  | `6`             | The minimum length required for the key. |
| `KEY_REMOVE`      | `false`         | If set to `true`, the URL record will be **deleted** when expired. If `false`, the URL will **only be marked as expired** |
| `MANUAL_DOMAINS`  | `["github.com"]` | URLs matching these domains will **not be automatically redirected**. A page will be displayed, requiring users to manually click to proceed. |

## API Usage

### Create a Short URL

**Request:**
```http
POST /
Content-Type: application/json
{
  "url": "https://coderxi.com/posts/url-shortener-with-cloudflare-worker",
  "password": "<YOUR_PASSWORD>",
  "key": "doc",
  "expireDay": 1
}
```
**Response:**
```json
{
  "key": "doc"
}
```