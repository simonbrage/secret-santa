# Secret Santa

The repository is split into frontend and backend - the two folders are self-explanatory (I hope).

## Frontend

The frontend is created with React's `create-react-app` and styled with TailwindCSS. 

`npm run build` builds the app, and can be hosted at the desired domain. The app's base route is `/secret-santa/`. Currently hosted on [simonbrage.dk/secret-santa](https://simonbrage.dk/secret-santa).

## Backend 

The backend is built using node.js, Express, and MongoDB. It uses HTTPS connection on an IIS server located at [talvan4.datahosting.dk](https://talvan4.datahosting.dk). The certificate is created using [Certbot](https://certbot.eff.org/). The process is managed using [PM2 for node.js](pm2.io).
