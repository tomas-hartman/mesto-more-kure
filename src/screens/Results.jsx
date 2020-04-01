import React from 'react';

export class Results extends React.Component {
    render() {

        // funguje pouze pro singleplayer
        // tady to spočítá výsledky a vypíše je
        // const mockData = [{ "catId": "0", "isCorrect": true }, { "catId": "1", "isCorrect": true }, { "catId": "2", "isCorrect": true }, { "catId": "3", "isCorrect": true }, { "catId": "4", "isCorrect": true }, { "catId": "5", "isCorrect": false }, { "catId": "6", "isCorrect": false }, { "catId": "7", "isCorrect": false }, { "catId": "8", "isCorrect": false }, { "catId": "9", "isCorrect": false }]

        const data = this.props.results;

        const pointedAnswers = data.filter(result => {
            if (result.isCorrect) {
                return true;
            }
        })

        const points = pointedAnswers.length * 10;

        console.log(points);


        return (
            <main className="screen">
                <div className="content eval-container">
                    <div className="headline">
                        <h1>Vyhodnocení</h1>
                    </div>
                    <table className="res-table">
                        <tbody>
                            <tr className="res-item" data-cat-id={this.props.catId}>
                                <th>Player 1</th>
                                <td>{points}b</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        )
    }
}