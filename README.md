# Secret Santa

The Secret Santa app is a digital tool designed to facilitate the organization and execution of Secret Santa games. It combines the traditional elements of the game with the convenience of modern technology. To see the app in action go to [simonbrage.dk/secret-santa](https://simonbrage.dk/secret-santa).

Here's how it works:

1. **Room Creation**: Users can create a room. This process generates a unique room object in the MongoDB database and provides a room key.
2. **Joining a Room**: Participants can enter the game by using the room key to join the designated room.
3. **Starting the Game**: The game begins when the room owner activates the "Start game" feature. This triggers the app to randomly assign the order of turns for participants.
4. **Gameplay**: Participants take turns placing their gifts under a real Christmas tree in the order set by the app. This ensures that the gift-giver's identity remains a secret.

An important aspect of the game is the need for a designated area where players wait without seeing who is placing their gift. This maintains the element of surprise and anonymity, which is crucial to the Secret Santa experience.

The app's goal is to simplify the organization of Secret Santa games while keeping the excitement and mystery of the traditional gift exchange alive.

## Setup

The repository is split into frontend and backend - the two folders are self-explanatory (I hope).

### Frontend setup

The frontend is created with React's `create-react-app` and styled with TailwindCSS. 

`npm run build` builds the app, and can be hosted at the desired domain. The app's base route is `/secret-santa/`.

### Backend setup

The backend is built using node.js, Express, and MongoDB. It uses an HTTPS connection on an IIS server. The certificate is created using [Certbot](https://certbot.eff.org/). The process is managed using [PM2 for node.js](pm2.io).
