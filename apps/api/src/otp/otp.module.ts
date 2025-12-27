import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { OtpController } from "./otp.controller";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { OtpAttemptModule } from "../otp-attempt/otp-attempt.module";
import { TokenModule } from "../token/token.module";

@Module({
	controllers: [OtpController],
	providers: [OtpService],
	imports: [UserModule, MailModule, OtpAttemptModule, TokenModule],
	exports: [OtpService],
})
export class OtpModule {}
