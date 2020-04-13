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

const Game = (gameId, player) => {
  const game = {
    id: "",
    settings: {},
    players: [],
    gamePlan: {},
    progress: {
      round: 1,
      category: 1,
      answered: []
    }
  };

  const settings = { // defaults
    playersNum: 2,
    categoriesNum: 5,
    roundsNum: 3,
  };

  function genRounds(num) {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const letterList = [];

    for (let i = 0; i < num; i++) {
      const letter = letters[Math.floor(Math.random() * letters.length)];
      letterList.push(letter);
    }

    return letterList;
  }

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
  }

  const createGamePlan = (data) => {
    let {
      categoriesNum,
      roundsNum
    } = data;
    let gamePlan = {};

    const rounds = genRounds(roundsNum);
    let categories = genCategories(roundsNum, categoriesNum);

    gamePlan.rounds = rounds;
    gamePlan.categories = categories;

    return gamePlan;
  };

  const gamePlan = createGamePlan({
    categoriesNum: settings.categoriesNum,
    roundsNum: settings.roundsNum
  });


  game.id = gameId;
  game.settings = settings;
  game.players.push(player);
  game.gamePlan = gamePlan;

  return game;
}


io.origins("*:*");

io.on("connection", socket => {
  console.log("User connected with id: ", socket.id);

  // Create game
  const requestUrl = new URL(socket.request.headers.referer);
  const urlParams = requestUrl.searchParams;

  const gameIdInParam = urlParams.get("g")
  console.log("Game id in param: ", gameIdInParam);

  if (gameIdInParam) {
    // console.log(games);
    if (games.hasOwnProperty(gameIdInParam)) { // check if game in fact exists
      // start new Game, add new Player
      // @todo broadcast gameId to the player - here, do not do it in frontend
      console.log("add new Player to the game");
      games[gameIdInParam].players.push(socket.id); // přidat: !connections.includes(socket.id)
      console.log(games);
    } else {
      // restartuj request
      console.error("Err: wrong request. Restartuj request.");
      socket.emit("restartRequest");
    }
    // new Game
    // vygeneruj nový gameId a emitni ho zpátky requestu

    // check for a game with params.g === xyz
    // if(game with params.g === xyz neexistuje){
    // refresh headers, smaž parametr a založ novou hru
    // } else {
    // přidej do hry novýho hráče a následně všem hráčům ve hře pošli startGame
    // }
  } else {
    console.log("Nová hra, zatím se nikde nic negeneruje.");

    // asi to nemá udělat nic, dokud nekliknu na btn, gameId se generuje až tam
  }

  socket.on("registerNewGame", () => {
    // Generate new game
    const randomGameId = "randomGameId";

    if (!games.hasOwnProperty(randomGameId)) {
      const game = Game(randomGameId, socket.id);

      console.log(game.gamePlan.rounds);
      console.log(game.gamePlan.categories);

      games[randomGameId] = game;

      // games[randomGameId] = {
      //   players: [socket.id],
      // };

      // games[randomGameId].players.push()

      console.log("Posílám gameId: ", randomGameId);
      console.log(games);
      socket.emit("gameId", randomGameId);
    }
  });

  /*
   * Shall game start
   * Checks if conditional number of players is connected to the game
   */
  socket.on("shallGameStart", (gameId) => {
    // pozor! shall game start valí v intervalu, vymyslet jak optimalizovat
    // gameId ? console.log(games[gameId].players.length) : console.log("nevím");
    if (gameId && games.hasOwnProperty(gameId) && games[gameId].players.length === 2) {
      console.log(gameId);
      socket.emit("startGame");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected, id: ", socket.id);

    if (connections.includes(socket.id)) {
      connections.splice(connections.indexOf(socket.id), 1);
    }

    // @todo temp řešení problému s přidáváním duplicit
    if (games.hasOwnProperty("randomGameId")) {
      delete games["randomGameId"];
    }

    // odstraní game, ve které byli hráči připojeni

    // delete gameState.players[socket.id]

    // handling - pokud je to hráč, kterej je zařazenej do gameId, pak konec hry a smazání té instance hry
  });
});

http.listen(8000, () => {
  console.log("listening on *:8000");
});