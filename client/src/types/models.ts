// Shared domain models mirroring the server's Prisma schema
// (server/prisma/schema.prisma).

export interface User {
	id: number;
	uuid: string;
	name: string;
}

export interface Move {
	id: number;
	uuid: string;
	userId: number;
	gameId: number;
}

export interface Game {
	id: number;
	uuid: string;
	// The API includes related users on Game responses.
	users: User[];
}
