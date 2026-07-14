import './index.css';
import ChessBoard from './components/ChessBoard';
import GameSettings from './components/GameSettings';

function App() {
	return (
		<div className='mx-auto flex w-[80%] items-start gap-8 py-8'>
			<div className='flex-1'>
				<ChessBoard />
			</div>
			<GameSettings />
		</div>
	);
}

export default App;
