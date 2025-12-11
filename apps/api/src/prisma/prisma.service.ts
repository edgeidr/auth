import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		super({
			transactionOptions: {
				timeout: 5 * 60 * 1000,
			},
		});
	}
}
