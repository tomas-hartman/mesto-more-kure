import React from 'react';
import socket from "./SocketContext";
import { SetupGame } from './screens/SetupGame';
import { GameScreen } from './screens/GameScreen';
import { Evaluation } from './screens/Evaluation';
import { Results } from './screens/Results';
import './screens.css';

// const socket = io();

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: "setup",
            // screen: "results",
            // screen: "evaluation",
            startGameState: null,
            gameId: null,
            gameProgress: {
                round: 1,
                word: 1,
            },
            gameData: {
                settings: { // defaults
                    playersNum: 1,
                    categoriesNum: 5,
                    roundsNum: 3,
                    id: "game_id"
                },
                players: [],
                game: []
            },
            evaluation: {
                categories: [],
                answers: [], // musí být per player!
                results: [] // musí být per player!
            }
        }
        this.setGame = this.setGame.bind(this);
        this.setData = this.setAppState.bind(this);
        this.updateGameProgress = this.updateGameProgress.bind(this);
        this.saveAnswer = this.saveAnswer.bind(this);
        this.prepareEvaluation = this.prepareEvaluation.bind(this);
        this.saveEvaluation = this.saveEvaluation.bind(this);
        this.setAppState = this.setAppState.bind(this);
    }

    componentDidMount() {
        const requestUrl = new URL(window.location);
        const urlParams = requestUrl.searchParams;
        const gameIdInParam = urlParams.get("g");

        console.log(gameIdInParam);

        const interval = setInterval(() => {
            // tohle bude vysílat pouze pokud bude state: ({gameStart: pending}) nebo pokud bude v parametru id hry - nastavený state: ({game: gameId})
            const gameId = this.state.gameId;
            socket.emit("shallGameStart", gameId);
        }, 100);

        socket.on("startGame", (value) => {
            clearInterval(interval);
            this.setState({ startGameState: "started" });
            this.setState({ screen: "game" });
        });

        socket.on("restartRequest", () => {
            const url = new URL(window.location)
            window.location = url.origin;
        });

        if (gameIdInParam) {
            this.setState({ gameId: gameIdInParam });
        } else {
            socket.on("gameId", id => {
                this.setState({ gameId: id }); // pro tohle id se potom vygeneruje link v podobě ?g=__id__
                this.setState({ startGameState: "pending" });
            });
        }
    }

    prepareEvaluation(data) {
        const [cat, ans, res] = data;

        let currentEvaluation = JSON.parse(JSON.stringify(this.state.evaluation));

        currentEvaluation.categories = cat;
        currentEvaluation.answers = ans;
        currentEvaluation.results = res;

        this.setState({ evaluation: currentEvaluation });
    }

    setAppState(data) {
        // {screen: "game"} etc.
        this.setState(data);
    }

    setGame(data) {
        const [type, value] = data;

        let currentGamedata = JSON.parse(JSON.stringify(this.state.gameData));

        console.log(value);
        currentGamedata[type].push(...value);

        this.setState({ gameData: currentGamedata })
    }

    saveEvaluation(type, value) {
        let currentData = JSON.parse(JSON.stringify(this.state.evaluation));

        console.log(type);
        console.log(value);

        currentData[type] = value;

        this.setState({ evaluation: currentData });
    }

    saveAnswer(player, value) {
        let currentGamedata = JSON.parse(JSON.stringify(this.state.gameData));
        const round = this.state.gameProgress.round;

        if (!!currentGamedata.game[round - 1].answers[player]) {
            console.log("tady");
            currentGamedata.game[round - 1].answers[player].push(value); // array -> do toho pushnu value
        } else {
            console.log("prdel");
            console.log(currentGamedata.game[round - 1].answers);
            currentGamedata.game[round - 1].answers[player] = [value];
        }

        this.setState({ gameData: currentGamedata });
    }

    updateGameProgress() {
        const state = this.state;
        let progress = JSON.parse(JSON.stringify(this.state.gameProgress));

        if (state.gameProgress.word + 1 > state.gameData.settings.categoriesNum) {
            if (state.gameProgress.round + 1 > state.gameData.settings.roundsNum) {
                console.log("round: ", state.gameProgress.round, " word: ", state.gameProgress.word);
                console.log("gameEnd"); // @todo => switch to next - evaluation screen
                this.setState({ screen: "evaluation" });
                return;
            }

            progress.word = 1;
            progress.round = progress.round + 1;

            // set: word = 1; round = round ++
            this.setState({ gameProgress: progress });
            console.log("round: ", state.gameProgress.round, " word: ", state.gameProgress.word);
            return;
        }

        progress.word = progress.word + 1;

        // set word ++
        this.setState({ gameProgress: progress });
        console.log("round: ", state.gameProgress.round, " word: ", state.gameProgress.word);
    }

    render() {
        // const urlParams = new URL(window.location.href).searchParams.get("g");

        // if (urlParams) {
        //     console.log("urlParams ", urlParams);

        //     // socket.emit("registerPlayer", urlParams);
        //     socket.emit("gameId", urlParams);
        // }

        if (this.state.screen === "setup") {
            return (
                <SetupGame
                    setAppState={this.setAppState}
                    setGame={this.setGame}
                    gameDefaults={this.state.gameData.settings}
                    startGameState={this.state.startGameState}
                    gameId={this.state.gameId}
                />
            );
        }
        if (this.state.screen === "game") {
            return (
                < GameScreen
                    gameData={this.state.gameData}
                    gameProgress={this.state.gameProgress}
                    saveAnswer={this.saveAnswer}
                    updateGameProgress={this.updateGameProgress}
                />
            );
        }
        if (this.state.screen === "evaluation") {
            return (
                < Evaluation
                    gameData={this.state.gameData.game}
                    prepareEvaluation={this.prepareEvaluation}
                    saveEvaluationToApp={this.saveEvaluation}
                    setData={this.setAppState}
                // gameProgress={this.state.gameProgress}
                // saveAnswer={this.saveAnswer}
                // updateGameProgress={this.updateGameProgress}
                />
            );
        }

        if (this.state.screen === "results") {
            return (
                < Results
                    results={this.state.evaluation.results}
                />
            )
        }
    }
};