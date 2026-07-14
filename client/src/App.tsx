import './index.css';
import ChessBoard from './components/ChessBoard';
import GameSettings from './components/GameSettings';
import AtTheTable from './components/AtTheTable';

function App() {
	return (
		<div className='mx-auto flex w-[80%] items-start gap-8 py-8'>
			<div className='flex-1'>
				<ChessBoard />
			</div>
			<div className='flex flex-col gap-6'>
				<GameSettings />
				<AtTheTable />
			</div>
		</div>
	);
}

export default App;
