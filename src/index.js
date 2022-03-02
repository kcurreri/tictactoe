import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    return (
        <button
            className={`square ${props.classes}`}
            onClick={props.onClick}
            style={props.style}
        >
            {props.value}
        </button>
    );
};

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                onClick={() => this.props.onClick(i)}
                value={this.props.squares[i]}
                classes={this.props.classes[i]}
            />
        );
    }

    render() {
        return (
            <React.Fragment>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </React.Fragment>
        );
    }
}

class HistoryButtons extends React.Component {
    render() {
        return this.props.squares.map((squares, i) => {
            let text =
                i === 0
                    ? 'Go to beginning'
                    : `Go to move #${i} - ${
                          this.props.lastMoveCoordinates[i - 1][1]
                      }(${this.props.lastMoveCoordinates[i - 1][0]})`;
            return (
                <p
                    key={i}
                    onClick={() => this.props.onClick(i)}
                    className={`history-button ${
                        i === this.props.stepNumber ? 'bold' : null
                    }`}
                >
                    {text}
                </p>
            );
        });
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: [Array(9).fill(null)],
            xIsNext: true,
            historyIsAscending: true,
            stepNumber: 0,
            lastMoveCoordinates: [[]],
        };
    }
    componentDidMount() {
        document.title = 'Tic Tac Toe | React Tutorial';
    }
    handleClick = (i) => {
        let squaresFullArray = [...this.state.squares];
        let currentSquares = [...this.state.squares[this.state.stepNumber]];
        if (calculateWinner(currentSquares) || currentSquares[i]) {
            return;
        }
        squaresFullArray.length = this.state.stepNumber + 1;
        currentSquares[i] = this.state.xIsNext ? 'X' : 'O';
        squaresFullArray.push(currentSquares);

        const coordinates = [
            [1, 1],
            [1, 2],
            [1, 3],
            [2, 1],
            [2, 2],
            [2, 3],
            [3, 1],
            [3, 2],
            [3, 3],
        ];
        let newArray = [...this.state.lastMoveCoordinates];
        newArray.length = this.state.stepNumber;
        newArray.push([coordinates[i], this.state.xIsNext ? 'X' : 'O']);

        this.setState({
            squares: squaresFullArray,
            xIsNext: !this.state.xIsNext,
            stepNumber: this.state.stepNumber + 1,
            lastMoveCoordinates: newArray,
        });
    };

    handleHistory(move) {
        this.setState({ stepNumber: move, xIsNext: move % 2 !== 1 });
    }
    handleHistoryToggle() {
        this.setState({ historyIsAscending: !this.state.historyIsAscending });
    }

    render() {
        let currentSquares = this.state.squares[this.state.stepNumber];
        let classes = Array(9).fill(null);

        let winner = calculateWinner(currentSquares);
        let status;
        if (winner) {
            winner.forEach((i) => (classes[i] = 'green'));
            status = `The winner is ${currentSquares[winner[0]]}`;
        } else if (currentSquares.every((i) => i !== null)) {
            status = 'DRAW!';
            classes = Array(9).fill('gray');
        } else {
            status = `${this.state.xIsNext ? 'X' : 'O'} is next`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        onClick={(i) => this.handleClick(i)}
                        squares={currentSquares}
                        classes={classes}
                    />
                    <div className="status">{status}</div>
                    <div className="game-info">
                        {this.state.squares.length > 1 && (
                            <React.Fragment>
                                <button
                                    className="history-order-toggle"
                                    onClick={() => this.handleHistoryToggle()}
                                >
                                    {this.state.historyIsAscending
                                        ? 'Ascending History'
                                        : 'Descending History'}
                                </button>
                                <div
                                    className={`history-buttons ${
                                        !this.state.historyIsAscending &&
                                        'reverse'
                                    }`}
                                >
                                    <HistoryButtons
                                        squares={this.state.squares}
                                        lastMoveCoordinates={
                                            this.state.lastMoveCoordinates
                                        }
                                        isAscending={
                                            this.state.historyIsAscending
                                        }
                                        stepNumber={this.state.stepNumber}
                                        onClick={(i) => this.handleHistory(i)}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
    const winners = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < winners.length; i++) {
        if (
            [
                squares[winners[i][0]],
                squares[winners[i][1]],
                squares[winners[i][2]],
            ].every((val, i, arr) => val === arr[0] && val !== null)
        ) {
            return winners[i];
        }
    }
}
