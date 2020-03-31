import React from 'react';

class EvalItem extends React.Component {

    setSelected(e) {
        //@todo if to druhý is chosen, tak unchose
        // kliknutí na tlačítko "Další" pak posílá batch
        e.target.classList.add("selected");
    }

    render() {
        return (
            <tr>
                <th>{this.props.category}</th>
                <td>{this.props.answer}</td>
                <td className="eval-btns">
                    <div className="eval-btns-container">
                        <button className="eval-fail" onClick={this.setSelected}>Fail</button>
                        <button className="eval-good" onClick={this.setSelected}>OK</button>
                    </div>
                </td>
            </tr>
        )
    }
}

export class Evaluation extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.updateState = this.updateState.bind(this);
        this.state = {
            answerIndex: 0,
            answerEnd: 5,
        }
    }

    prepareEval() {


        // this.setState({ answers: answers });
        // this.setState({ categories: categories });
    }

    onClick() {
        this.setState({ answerIndex: this.state.answerIndex + 5 });
        this.setState({ answerEnd: this.state.answerEnd + 5 });

    }

    updateState(data) {
        this.setState(data);
    }

    render() {
        const gameData = this.props.gameData;
        let categories = [];
        let answers = [];
        let results = [];

        for (let i in gameData) {
            const key = Object.keys(gameData[i].answers);
            const values = gameData[i].answers[key[0]];
            const tempCategories = gameData[i].categories;

            answers = [...answers, ...values];
            categories = [...categories, ...tempCategories];
        }

        let mappedElements = Array(categories.length).fill(null).map((_item, id) => {
            return < EvalItem answer={answers[id]} category={categories[id]} key={id} />
        });

        results = Array(categories.length).fill(null);

        // this.props.prepareEvaluation([categories, answers, results]);

        const displayedElements = mappedElements.slice(this.state.answerIndex, this.state.answerEnd);

        return (
            <main className="screen">
                <div className="content eval-container">
                    <div className="headline">
                        <h1>Vyhodnocení</h1>
                    </div>
                    <table className="eval-table">
                        <tbody>
                            {displayedElements}
                            <tr>
                                <th></th>
                                <td></td>
                                <td className="eval-btns">
                                    <div className="eval-btns-container">
                                        <button className="eval-next" onClick={this.onClick}>Další</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        )
    }
}