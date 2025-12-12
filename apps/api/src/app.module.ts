import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { TokenModule } from "./token/token.module";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TokenModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
