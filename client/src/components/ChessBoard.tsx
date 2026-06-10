import { Chessboard, type ChessboardOptions } from 'react-chessboard';

const options: ChessboardOptions = {
	allowDragging: true,
	boardOrientation: 'white',
};

export default function ChessBoard() {
	return <Chessboard options={options} />;
}
