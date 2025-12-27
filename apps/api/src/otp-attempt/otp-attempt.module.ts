import { Module } from "@nestjs/common";
import { OtpAttemptService } from "./otp-attempt.service";

@Module({
	providers: [OtpAttemptService],
	exports: [OtpAttemptService],
})
export class OtpAttemptModule {}
