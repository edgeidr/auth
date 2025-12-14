import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { TokenModule } from "./token/token.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SessionModule } from "./session/session.module";
import { UserAuthStateModule } from "./user-auth-state/user-auth-state.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		TokenModule,
		AuthModule,
		UserModule,
		SessionModule,
		UserAuthStateModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
