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

    makeId = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
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

        // Potom čekám na server, až mi pošle change screen rozhodnutí.

    }

    render() {
        const { playersNum, categoriesNum, roundsNum } = this.props.gameDefaults;

        const gameLink = `${window.location.href}?g=${this.state.gameId}`;
        let elm = "";

        const input = <input type="text" name="game-link" value={gameLink} />;
        const btn = <button onClick={() => this.startGame(playersNum, categoriesNum, roundsNum)}>Začít hru</button>;

        if (this.state.pending) {
            return input;
        } else {
            return btn;
        }
    }
}

export class SetupGame extends React.Component {

    // genLetter() {
    //     const letters = "abcdefghijklmnopqrstuvwxyz";
    //     const letter = letters[Math.floor(Math.random() * letters.length)];

    //     return letter;
    // }

    // genCategories(categoriesNum) {
    //     const data = [];

    //     for (let i = 0; i < categoriesNum; i++) {
    //         data.push(categories[Math.floor(Math.random() * categories.length)]);
    //     }

    //     return data;
    // }



    componentDidMount() {
        // socket.on("gameStart", (val) => {
        //     if (val) {
        //         this.props.setData({ screen: "game" });
        //         console.log("Game started");
        //     }
        // });
    }

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

                    < GameStartElm gameDefaults={this.props.gameDefaults} />
                </div>
            </main>
        )
    }
}