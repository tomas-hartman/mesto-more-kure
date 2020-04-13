import React from 'react';
import { categories } from '../data/categories';
import socket from '../SocketContext';

class GameStartElm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pending: false,
            gameId: "",
        }
    }

    startGame(playersNum, categoriesNum, roundsNum) {
        /* 
        1. vybrat písmeno
        2. vygenerovat hráče
        3. vygenerovat kola + kategorie
         */

        const settings = { // defaults
            playersNum: 2,
            categoriesNum: 5,
            roundsNum: 3,
            id: "game_id"
        }

        socket.emit("gameSettings", settings); // @todo má posílat pouze to, co si nastaví uživatel, bude se posílat v rámci registerNewGame
        socket.emit("registerNewGame");
        this.props.setAppState({
            startGameState: "waitForId",
        });
        // this.setState({ pending: true });
        // Potom čekám na server, až mi pošle change screen rozhodnutí.

    }

    render() {
        const { playersNum, categoriesNum, roundsNum } = this.props.gameDefaults;

        const gameLink = `${window.location.href}?g=${this.props.gameId}`;
        let elm = "";

        const input = <input type="text" name="game-link" value={gameLink} />;
        const btn = <button onClick={() => this.startGame(playersNum, categoriesNum, roundsNum)}>Začít hru</button>;

        if (this.props.startGameState) {
            return input;
        } else {
            return btn;
        }
    }
}

export class SetupGame extends React.Component {
    render() {
        const { playersNum, categoriesNum, roundsNum } = this.props.gameDefaults;

        return (
            <main className="screen">
                <div className="content center">
                    <table>
                        <tbody>
                            <tr>
                                <th>Počet hráčů</th>
                                <td>{playersNum}</td>
                            </tr>
                            <tr>
                                <th>Počet kategorií</th>
                                <td>{categoriesNum}</td>
                            </tr>
                            <tr>
                                <th>Počet kol</th>
                                <td>{roundsNum}</td>
                            </tr>
                        </tbody>
                    </table>

                    < GameStartElm
                        setAppState={this.props.setAppState}
                        gameDefaults={this.props.gameDefaults}
                        startGameState={this.props.startGameState}
                        gameId={this.props.gameId}
                    />
                </div>
            </main>
        )
    }
}