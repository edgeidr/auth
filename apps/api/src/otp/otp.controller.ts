import { Body, Controller, Post } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { VerifyOtpInput } from "./inputs/verify-otp.input";

@Controller("otps")
export class OtpController {
	constructor(private readonly otpService: OtpService) {}

	@Post("verify")
	verify(@Body() verifyOtpDto: VerifyOtpDto) {
		const payload: VerifyOtpInput = {
			code: verifyOtpDto.code,
			id: verifyOtpDto.token,
		};

		return this.otpService.verifyCode(payload);
	}
}
