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
import { OtpModule } from "./otp/otp.module";
import { MailModule } from "./mail/mail.module";
import { OtpAttemptModule } from "./otp-attempt/otp-attempt.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		TokenModule,
		AuthModule,
		UserModule,
		SessionModule,
		UserAuthStateModule,
		OtpModule,
		MailModule,
		OtpAttemptModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
