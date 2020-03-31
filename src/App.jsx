import React from 'react';
import { SetupGame } from './screens/SetupGame';
import { GameScreen } from './screens/GameScreen';
import { Evaluation } from './screens/Evaluation';
import './screens.css';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: "setup",
            // screen: "evaluation",
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
                answers: [],
                results: []
            }
        }
        this.setGame = this.setGame.bind(this);
        this.setData = this.setData.bind(this);
        this.updateGameProgress = this.updateGameProgress.bind(this);
        this.saveAnswer = this.saveAnswer.bind(this);
        this.prepareEvaluation = this.prepareEvaluation.bind(this);
    }

    prepareEvaluation(data) {
        const [cat, ans, res] = data;

        let currentEvaluation = JSON.parse(JSON.stringify(this.state.evaluation));

        currentEvaluation.categories = cat;
        currentEvaluation.answers = ans;
        currentEvaluation.results = res;

        this.setState({ evaluation: currentEvaluation });
    }

    setData(data) {
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
        if (this.state.screen === "setup") {
            return (
                <SetupGame
                    setData={this.setData}
                    setGame={this.setGame}
                    gameDefaults={this.state.gameData.settings}
                />);
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
                // gameProgress={this.state.gameProgress}
                // saveAnswer={this.saveAnswer}
                // updateGameProgress={this.updateGameProgress}
                />
            );
        }
    }
};