import { Swords } from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
	TIME_CONTROLS,
	useGameStore,
	type PlayerSlot,
	type TimeControl,
} from '@/stores/gameStore';

const PLAYER_SLOTS: { slot: PlayerSlot; label: string; dark: boolean }[] = [
	{ slot: 'W1', label: 'W1', dark: false },
	{ slot: 'B1', label: 'B1', dark: true },
	{ slot: 'W2', label: 'W2', dark: false },
	{ slot: 'B2', label: 'B2', dark: true },
];

// A small uppercase section heading, matching the design's labels.
function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<p className='text-[0.7rem] font-semibold tracking-widest text-muted-foreground uppercase'>
			{children}
		</p>
	);
}

export default function GameSettings() {
	const settings = useGameStore((s) => s.settings);
	const setTimeControl = useGameStore((s) => s.setTimeControl);
	const setPlayerName = useGameStore((s) => s.setPlayerName);

	return (
		<Card className='w-full max-w-sm'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-base'>
					<Swords className='size-4' />
					Game Settings
				</CardTitle>
			</CardHeader>

			<CardContent className='flex flex-col gap-5'>
				{/* Variant */}
				<div className='flex flex-col gap-2'>
					<SectionLabel>Variant</SectionLabel>
					<div className='rounded-none bg-muted/40 p-3 ring-1 ring-foreground/10'>
						<p className='text-sm font-medium text-foreground'>
							Team Alternating
						</p>
						<CardDescription className='mt-0.5'>
							Order of play: W1 → B1 → W2 → B2. Partners share a side but move
							one at a time.
						</CardDescription>
					</div>
				</div>

				{/* Time control */}
				<div className='flex flex-col gap-2'>
					<SectionLabel>Time control (per team)</SectionLabel>
					<div className='flex flex-wrap gap-2'>
						{TIME_CONTROLS.map((minutes) => (
							<TimeControlButton
								key={minutes}
								minutes={minutes}
								selected={settings.timeControl === minutes}
								onSelect={() => setTimeControl(minutes)}
							/>
						))}
					</div>
				</div>

				{/* Players */}
				<div className='flex flex-col gap-2'>
					<SectionLabel>Players</SectionLabel>
					<div className='flex flex-col gap-2'>
						{PLAYER_SLOTS.map(({ slot, label, dark }, index) => (
							<div key={slot} className='flex items-center gap-2'>
								<SlotBadge label={label} dark={dark} />
								<Input
									value={settings.players[slot]}
									onChange={(e) => setPlayerName(slot, e.target.value)}
									placeholder={`Player ${index + 1}`}
									className='flex-1'
								/>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function TimeControlButton({
	minutes,
	selected,
	onSelect,
}: {
	minutes: TimeControl;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<button
			type='button'
			aria-pressed={selected}
			onClick={onSelect}
			className={cn(
				'h-9 min-w-12 rounded-none border px-3 text-sm font-medium transition-colors',
				selected
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background text-foreground hover:bg-muted',
			)}
		>
			{minutes}&prime;
		</button>
	);
}

function SlotBadge({ label, dark }: { label: string; dark: boolean }) {
	return (
		<span
			className={cn(
				'flex size-8 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-semibold uppercase',
				dark
					? 'bg-foreground text-background'
					: 'border border-border bg-background text-foreground',
			)}
		>
			{label}
		</span>
	);
}
