# SMK Rework Splitted Version for Admin

## Build Setup
**[Node.js](https://nodejs.org/en/download/current) >= 14.7.0**

### Google Recaptcha
Can be obtained at [Google Recaptcha](https://www.google.com/recaptcha/admin)
- Recaptcha version 2
- domain `localhost` and `127.0.0.1`

```bash
# duplicate environment
$ cp .env.example .env

# setup the environment
# MIX_APP_URL = API URL
# MIX_APP_URL_FE = Front End URL
# MIX_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SITE_KEY

# install dependencies
$ npm install

# serve with hot reload at localhost:3001
$ npm run dev
```
