const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const categoriesList = require("./data/categories");

let connections = [];
const games = {};

/**
 * Generuje gameId
 * @param {number} length = 12 default
 */
const generateId = (length = 12) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Game constructing function
 * @param {string} gameId 
 * @param {string} player First player socket.id
 * @todo možná změnit player na object, protože player se bude identifikovat jako objekt
 */
const Game = (gameId, player) => {
  const game = {
    id: "",
    settings: {},
    players: [],
    gamePlan: {},
    progress: {
      state: null,
      round: 1,
      category: 1,
      answered: []
    }
  };

  // defaults:
  const settings = {
    playersNum: 2,
    categoriesNum: 5,
    roundsNum: 3,
  };

  // methods:
  const genRounds = (num) => {
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

  // Initialize game
  const requestUrl = new URL(socket.request.headers.referer);
  const urlParams = requestUrl.searchParams;
  const gameIdInParam = urlParams.get("g")

  console.log("Game id in param: ", gameIdInParam);

  // check if gameParam is present:
  if (gameIdInParam) {
    // check if game in fact exists (is initialized):
    if (games.hasOwnProperty(gameIdInParam)) {
      // start new Game, add new Player
      // @todo broadcast gameId to the player - here, do not do it in frontend
      console.log("add new Player to the game");
      games[gameIdInParam].players.push(socket.id); // přidat: !connections.includes(socket.id)
      console.log(games);
    } else {
      // restartuj request s neexistujícím gameId
      console.error("Err: wrong request. Restartuj request.");
      socket.emit("restartRequest");
    }
  } else {
    // Nemá dělat nic, dokud nekliknu na "začít hru". GameId se generuje až tam
    console.log("Nová hra, zatím se nikde nic negeneruje.");
  }

  // Generate new game:
  socket.on("registerNewGame", () => {
    const randomGameId = "randomGameId";
    // const randomGameId = generateId(); // odkomentovat, až se vyřeší on.disconnect

    if (!games.hasOwnProperty(randomGameId)) {
      const game = Game(randomGameId, socket.id);

      // console.log(game.gamePlan.rounds);
      // console.log(game.gamePlan.categories);

      games[randomGameId] = game;

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
    // pozor! shall game start valí v intervalu, vymyslet, jak optimalizovat!
    if (gameId && games.hasOwnProperty(gameId) && games[gameId].players.length === games[gameId].settings.playersNum) {
      console.log(gameId);

      const game = games[gameId];
      game.progress.state = "started";
      socket.emit("startGame");
    }
  });

  socket.on("getNextTurn", (id) => {
    let {
      settings,
      gamePlan,
      progress
    } = games[id];

    // @todo add conditionals for the endings
    const roundId = progress.round;
    const categoryId = progress.category;

    const response = {
      letter: gamePlan.rounds[roundId],
      category: gamePlan.categories[roundId][categoryId],
    }

    // progress.category++; // tohle taky oconditionalovat: tohle ++ pouze ve chvíli, kdy odpoví všichni hráči

    console.log(games[id]);

    socket.emit("nextTurn", response);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected, id: ", socket.id);

    if (connections.includes(socket.id)) {
      connections.splice(connections.indexOf(socket.id), 1);
    }

    // odstranit game, ve které byli odpojení hráči připojeni
    // @todo temp řešení problému s přidáváním duplicit a mazáním neaktivních her!
    if (games.hasOwnProperty("randomGameId")) {
      delete games["randomGameId"];
    }
  });
});

http.listen(8000, () => {
  console.log("listening on *:8000");
});