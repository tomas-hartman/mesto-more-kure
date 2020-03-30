import React from 'react';
import { categories } from '../data/categories';

export class SetupGame extends React.Component {
    genLetter() {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const letter = letters[Math.floor(Math.random() * letters.length)];

        return letter;
    }

    genCategories(categoriesNum) {
        const data = [];

        for (let i = 0; i < categoriesNum; i++) {
            data.push(categories[Math.floor(Math.random() * categories.length)]);
        }

        return data;
    }

    async startGame(playersNum, categoriesNum, roundsNum) {
        /* 
        1. vybrat písmeno
        2. vygenerovat hráče
        3. vygenerovat kola + kategorie
         */

        const players = [];

        for (let j = 0; j < playersNum; j++) {
            const player = {
                nick: `Player ${j}`,
                id: `player_${j}_id`,
            }

            console.log(player);
            players.push(player);
        }



        const rounds = [];

        for (let i = 0; i < roundsNum; i++) {
            const round = {
                letter: this.genLetter(),
                categories: this.genCategories(categoriesNum),
                answers: {},
            }

            rounds.push(round);
        }
        await this.props.setGame(["players", players]);
        await this.props.setGame(["game", rounds]);
        await this.props.setData({ screen: "game" });

        console.log("Game started");
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

                    <button onClick={() => this.startGame(playersNum, categoriesNum, roundsNum)}>Začít hru</button>
                </div>
            </main>
        )
    }
}