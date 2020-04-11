const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const categoriesList = require("./data/categories");

let connections = [];
const games = {};
const game = {
  id: "",
  gameSettings: {},
  players: [],
  gamePlan: {}
};

const genRounds = num => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const letterList = [];

  for (let i = 0; i < num; i++) {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    letterList.push(letter);
  }

  return letterList;
};

const genCategories = (roundsNum, categoriesNum) => {
  const data = [];

  for (let j = 0; j < roundsNum; j++) {
    const cats = [];
    for (let i = 0; i < categoriesNum; i++) {
      cats.push(
        categoriesList[Math.floor(Math.random() * categoriesList.length)]
      );
    }
    data.push(cats);
  }

  return data;
};

const createGamePlan = data => {
  let {
    categoriesNum,
    roundsNum
  } = data;
  let gamePlan = {};

  let rounds = genRounds(roundsNum);
  let categories = genCategories(roundsNum, categoriesNum);

  gamePlan.rounds = rounds;
  gamePlan.categories = categories;

  return gamePlan;
};

io.origins("*:*");

io.on("connection", socket => {
  // Create game
  const requestUrl = new URL(socket.request.headers.referer);
  const urlParams = requestUrl.searchParams;

  console.log(urlParams.get("g"));

  if (urlParams.get("g")) {
    games["randomGameId"] = {};
    console.log(games);
    // new Game
    // vygeneruj nový gameId a emitni ho zpátky requestu
  } else {
    console.log("Takhle to nepůjde");
    //check for a game with params.g === xyz
    // if(game with params.g === xyz neexistuje){
    // refresh headers, smaž parametr a založ novou hru
    // } else {
    // přidej do hry novýho hráče a následně všem hráčům ve hře pošli startGame
    // }
  }
  console.log("a user connected ", socket.id);

  // temp: players
  if (!connections.includes(socket.id)) {
    connections.push(socket.id);
    console.log("connections: ", connections);
  }

  // Game start
  socket.on("shallGameStart", () => {
    if (connections.length === 2) {
      socket.emit("startGame");
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    if (connections.includes(socket.id)) {
      connections.splice(connections.indexOf(socket.id), 1);
    }

    // odstraní game, ve které byli hráči připojeni

    // delete gameState.players[socket.id]

    // handling - pokud je to hráč, kterej je zařazenej do gameId, pak konec hry a smazání té instance hry
  });
});

http.listen(8000, () => {
  console.log("listening on *:8000");
});