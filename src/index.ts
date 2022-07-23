import { listen } from './server';
import { connectDb } from './prisma';

async function start() {
	await connectDb();
	listen();
}

start();
