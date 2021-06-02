const evaluateMove = (move, penambah = 0) => {
    let sum = 0;
    if ('remove' in move) {
        if (move["removePiece"][1].toLowerCase() == "p")
            sum += 20 + penambah
        else
            sum += 100 + penambah
    }

    if ('promote' in move)
        sum += 60;

    if ('nextEat' in move) {
        sum += evaluateMove(move.nextEat, penambah);
    }
    return sum;
}

const minmax = (position, depth, alpha, beta, isMaximizingPlayer, sum, turn, color) => {
    jumlahNode++;
    let moves = getAllMoves(turn, position)
        .reduce((arr, m) => {
            spreadNextEat(m)
                .forEach(m2 => arr.push(m2))
            return arr;
        }, []);

    moves.sort(function (a, b) {
        return Math.random() - Math.random()
    });

    // console.log(moves);
    if (depth == 0 || moves.length == 0)
        return [null, sum];

    let maxValue = Number.NEGATIVE_INFINITY;
    let minValue = Number.POSITIVE_INFINITY;
    let bestMove;
    let move;
    for (let i = 0; i < moves.length; i++) {
        move = moves[i];
        let newSum;
        let newPos = position;
        let newMove = {
            ...move
        };
        let newTurn;

        if (turn == color) newSum = sum + evaluateMove(move, depth);
        else newSum = sum - evaluateMove(move, depth);


        while ("nextEat" in newMove) {
            newPos = movePiece(newMove, newPos);
            newMove = newMove.nextEat;
        }

        newPos = movePiece(newMove, newPos);

        if (turn == "white") newTurn = "black";
        else newTurn = "white";

        const [childBestMove, childValue] = minmax(newPos, depth - 1, alpha, beta, !isMaximizingPlayer,
            newSum,
            newTurn, color);

        if (isMaximizingPlayer) {
            if (childValue > maxValue) {
                maxValue = childValue;
                bestMove = move;
            }

            if (childValue > alpha) alpha = childValue;

        } else {
            if (childValue < minValue) {
                minValue = childValue;
                bestMove = move;
            }
            if (childValue < beta) beta = childValue;
        }

        // Alpha-beta pruning
        if (alpha >= beta) {
            break;
        }
    }


    if (isMaximizingPlayer) {
        return [bestMove, maxValue]
    } else {
        return [bestMove, minValue];
    }
}