import React from 'react';
import socket from '../SocketContext';

export class GameScreen extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this.state = {
            roundNum: 1,
            categoryNum: 1,
            answered: [],
            letter: "",
            category: ""
        }
    }

    _handleKeyDown(e) {
        if (e.key === "Enter") {
            this.onClick();
        }
    }

    componentDidMount() {
        console.log("Ahoj, component did mount");
        const gameId = this.props.gameId;

        socket.emit("getNextTurn", gameId);
        socket.on("nextTurn", data => {
            let { letter, category } = data;
            console.log(data);
            this.setState({ category });
            this.setState({ letter });
        });
    }

    onClick() {
        const playerId = this.props.gameData.players[0].id; // @todo!
        let value = document.querySelector("input").value;
        this.props.saveAnswer(playerId, value);

        console.log(value);

        document.querySelector("input").value = "";

        this.props.updateGameProgress();

        // const answerObj =
        /**
         * 1. získej value
         * 2. validuj, jestli už ji stejný hráč nepoužil - pokud není "", to použít může
         * 2. přidej answer do gameData.game[round].answer.playerId
         * 3. checkni jestli už je další kolo nebo ne
         * 4. posuň categories nebo kolo
         */

    }

    render() {
        // const gameData = this.props.gameData;
        // let { round: roundNum, word: categoryNum } = this.props.gameProgress;

        // const round = gameData.game[roundNum - 1];

        // const category = round.categories[categoryNum - 1];
        // const letter = round.letter;

        const letter = this.state.letter;
        const category = this.state.category;

        return (
            <main className="screen">
                <div className="content">
                    <div className="letter">
                        {letter.toUpperCase()}
                    </div>
                    <div className="headline">
                        <h1>{category}</h1>
                    </div>
                    <div className="control-content">
                        <div className="control-container">
                            <input type="text" onKeyDown={this._handleKeyDown} />
                            <button type="submit" onClick={this.onClick}>OK</button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}