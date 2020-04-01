import React from 'react';

class NextButton extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onClickRes = this.onClickRes.bind(this);
    }

    checkAnswers() {
        let evaluatedAnswers = [];
        const evaluatedItems = document.querySelectorAll(".eval-item");

        evaluatedItems.forEach((item) => {
            const catId = item.dataset.catId;
            const answered = item.querySelector(".selected");
            const answer = (answered.dataset.isCorrect === "true");

            const obj = {
                catId: catId,
                isCorrect: answer
            }

            evaluatedAnswers = [...evaluatedAnswers, obj];
        });

        return evaluatedAnswers;
    }

    onClick() {
        const evaluatedAnswers = this.checkAnswers();

        console.log(evaluatedAnswers);

        this.props.saveEvaluation(evaluatedAnswers);

        this.props.updateAnswerProgress();
    }

    async onClickRes() {
        // Toto pošle všechny do APP a přepne screen na "results"

        const evaluatedAnswers = this.checkAnswers();
        await this.props.saveEvaluation(evaluatedAnswers);

        console.log(evaluatedAnswers);

        await this.props.saveEvaluationToApp("results", this.props.evaluatedAnswers);

        await this.props.setData({ screen: "results" });
    }

    render() {
        const answerEnd = this.props.answerEnd;
        const categoriesCount = this.props.categoriesCount; // v budoucnu to bude nějakej počet celkem připravených kategorií na evaluaci

        const btnNext = <button className="eval-next" onClick={this.onClick}>Další</button>;
        const btnFinish = <button className="eval-next eval-res" onClick={this.onClickRes}>Vyhodnotit</button>;
        let btn = btnNext;

        // console.log(answerEnd);
        // console.log(categoriesCount);

        // console.log(categoriesCount - answerEnd);
        if (categoriesCount - answerEnd < 5) {
            btn = btnFinish;
        }

        return (
            <tr>
                <th></th>
                <td></td>
                <td className="eval-btns">
                    <div className="eval-btns-container">
                        {btn}
                    </div>
                </td>
            </tr>
        )
    }
}

class EvalItem extends React.Component {

    setSelected(e) {
        //@todo if to druhý is chosen, tak unchose
        // kliknutí na tlačítko "Další" pak posílá batch
        if (e.target.closest("div.eval-btns-container").querySelectorAll(".selected").length > 0) {
            console.log(
                e.target.closest("div.eval-btns-container").querySelector(".selected").classList.remove("selected")
            );
        }

        if (e.target.classList.contains("eval-fail")) {
            e.target.setAttribute("data-is-correct", false);
        } else {
            e.target.setAttribute("data-is-correct", true);
        }

        e.target.classList.add("selected");
    }

    render() {
        return (
            <tr className="eval-item" data-cat-id={this.props.catId}>
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
        this.saveEvaluation = this.saveEvaluation.bind(this);
        this.updateAnswerProgress = this.updateAnswerProgress.bind(this);
        this.state = {
            answerIndex: 0,
            answerEnd: 5,
            evaluatedAnswers: [],
        }
    }

    prepareEval() {


        // this.setState({ answers: answers });
        // this.setState({ categories: categories });
    }


    saveEvaluation(data) {
        const currentEval = this.state.evaluatedAnswers;

        const newEval = [...currentEval, ...data];

        this.setState({ evaluatedAnswers: newEval });
    }

    updateAnswerProgress() {
        this.setState({ answerIndex: this.state.answerIndex + 5 });
        this.setState({ answerEnd: this.state.answerEnd + 5 });
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
            return < EvalItem answer={answers[id]} category={categories[id]} key={id} catId={id} />
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
                            < NextButton
                                updateAnswerProgress={this.updateAnswerProgress}
                                saveEvaluation={this.saveEvaluation}
                                saveEvaluationToApp={this.props.saveEvaluationToApp}
                                answerEnd={this.state.answerEnd}
                                categoriesCount={categories.length}
                                evaluatedAnswers={this.state.evaluatedAnswers}
                                setData={this.props.setData}
                            />
                        </tbody>
                    </table>
                </div>
            </main>
        )
    }
}