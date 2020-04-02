// Example sturcture of gameData

const gameData = {
    settings: { // defaults
        players: 2,
        categories: 5,
        rounds: 3,
        id: "game_id"
    },
    players: [{
        nick: "Player 1",
        id: "player1_id"
    }, {
        nick: "Player 2",
        id: "player2_id"
    }],
    game: [{
            letter: "r", // chosen randomly for each round
            categories: [
                "osobnost", "mesto", "jidlo", "reka", "stat" // generated randomly for each round
            ],
            answers: {
                player1_id: ["", "Ravenna", "ravioli"],
                player2_id: ["Ronaldinho", "Rumburk", "remuláda"]
            }
        },
        {
            letter: "k",
            categories: [
                "osobnost", "mesto", "jidlo", "reka", "stat"
            ],
            answers: [{
                player1_id: "Karel Gott",
                player2_id: "Klement Gottwald"
            }, {
                player1_id: "Kirkúk",
                player2_id: "Kraków"
            }, {
                player1_id: "knedlík",
                player2_id: "klobása"
            }] // ...
        },
        {
            letter: "m",
            categories: [
                "osobnost", "mesto", "jidlo", "reka", "stat"
            ],
            answers: [] // round not yet played
        }
    ],
    results: {}
}