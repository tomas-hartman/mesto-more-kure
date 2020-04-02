const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const categoriesList = require('./data/categories');


let connections = [];
const gameBlueprint = {
    id: "",
    gameSettings: {},
    players: [],
    gamePlan: {}
};
const games = {};

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
            cats.push(categoriesList[Math.floor(Math.random() * categoriesList.length)]);
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

    let rounds = genRounds(roundsNum);
    let categories = genCategories(roundsNum, categoriesNum);

    gamePlan.rounds = rounds;
    gamePlan.categories = categories;

    return gamePlan;
}





app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});

io.origins("*:*");

io.on("connection", socket => {

    console.log("a user connected ", socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected");

        const playerIndex = gameBlueprint.players.indexOf(socket.id);

        if (playerIndex > 0) {
            gameBlueprint.players = []; // reset hry - hráče bude třeba resetovat i jinak a jinde
        }

        // handling - pokud je to hráč, kterej je zařazenej do gameId, pak konec hry a smazání té instance hry
    });

    socket.on("gameSettings", data => {
        const gameCopy = JSON.parse(JSON.stringify(gameBlueprint));
        games[data.id] = gameCopy;

        const game = games[data.id]; // this instance of game, to distinguish each instance

        game.gameSettings = data;
        game.id = game.gameSettings.id; // id bych si měl generovat asi automaticky tady!

        game.players.push(socket.id);

        // Zde to vygeneruje hru
        game.gamePlan = createGamePlan(game.gameSettings);

        console.log(games);
        // console.log(thisGame);
        // console.log(thisGame.gamePlan.categories);
        // console.log(thisGame.players);

        setInterval(() => {
            if (game.players.length === game.gameSettings.playersNum) {
                socket.emit("gameStart", true);
            }
        }, 10);
    });

    socket.on("gameId", (id) => {
        // console.log(id);
        if (!!games[id]) {
            games[id].players.push(socket.id);
        }
    });



    socket.emit("gotData", "ahoj!")
});

http.listen(8000, () => {
    console.log("listening on *:8000");
});