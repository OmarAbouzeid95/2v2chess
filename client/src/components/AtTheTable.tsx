import { Users } from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useGameStore, type PlayerSlot } from '@/stores/gameStore';

type TeamMember = { order: number; slot: PlayerSlot };

const TEAMS: { name: string; dark: boolean; members: TeamMember[] }[] = [
	{
		name: 'White',
		dark: false,
		members: [
			{ order: 1, slot: 'W1' },
			{ order: 2, slot: 'W2' },
		],
	},
	{
		name: 'Black',
		dark: true,
		members: [
			{ order: 1, slot: 'B1' },
			{ order: 2, slot: 'B2' },
		],
	},
];

// Default display names, matching the placeholders in GameSettings
// (slot order W1, B1, W2, B2 → Player 1…4).
const DEFAULT_NAME: Record<PlayerSlot, string> = {
	W1: 'Player 1',
	B1: 'Player 2',
	W2: 'Player 3',
	B2: 'Player 4',
};

export default function AtTheTable() {
	const players = useGameStore((s) => s.settings.players);

	return (
		<Card className='w-full max-w-sm'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-base'>
					<Users className='size-4' />
					At the Table
				</CardTitle>
				<CardDescription>
					Chat opens once the match begins. Until then, review the
					pairings and get comfortable.
				</CardDescription>
			</CardHeader>

			<CardContent className='flex flex-col gap-3'>
				{TEAMS.map((team) => (
					<TeamPanel
						key={team.name}
						team={team}
						players={players}
					/>
				))}
			</CardContent>
		</Card>
	);
}

function TeamPanel({
	team,
	players,
}: {
	team: (typeof TEAMS)[number];
	players: Record<PlayerSlot, string>;
}) {
	return (
		<div
			className={cn(
				'flex flex-col gap-3 rounded-none p-4',
				team.dark
					? 'bg-foreground text-background'
					: 'bg-muted/40 text-foreground ring-1 ring-foreground/10',
			)}
		>
			<div className='flex items-center justify-between'>
				<span className='font-heading text-sm font-semibold tracking-wide uppercase'>
					{team.name}
				</span>
				<span
					className={cn(
						'text-[0.7rem] tracking-wide',
						team.dark
							? 'text-background/60'
							: 'text-muted-foreground',
					)}
				>
					Team
				</span>
			</div>

			<ul className='flex flex-col gap-2'>
				{team.members.map(({ order, slot }) => (
					<li key={slot} className='flex items-center gap-2.5'>
						<span
							className={cn(
								'text-xs font-medium',
								team.dark
									? 'text-background/50'
									: 'text-muted-foreground',
							)}
						>
							#{order}
						</span>
						<span className='text-sm font-medium'>
							{players[slot].trim() || DEFAULT_NAME[slot]}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
