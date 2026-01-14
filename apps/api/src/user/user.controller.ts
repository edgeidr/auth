import { Body, Controller, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateMyProfileDto } from "./dto/update-my-profile.dto";
import { Request } from "express";
import { JwtAccessGuard } from "../jwt/jwt.guard";
import { UpdateUserProfileInput } from "./inputs/update-user-profile.input";
import { UpdateEmailDto } from "./dto/update-email.dto.";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ResetPasswordInput } from "./inputs/reset-password.input";
import { UpdateEmailInput } from "./inputs/update-email.input";

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAccessGuard)
	@Patch("me/profile")
	async updateMyProfile(@Body() updateMyProfileDto: UpdateMyProfileDto, @Req() request: Request) {
		const { userId } = request.user as { userId: string };
		const payload: UpdateUserProfileInput = {
			userId,
			firstName: updateMyProfileDto.firstName,
			lastName: updateMyProfileDto.lastName,
		};

		await this.userService.update(payload);

		return { message: "common.message.profileUpdateSuccess" };
	}

	@UseGuards(JwtAccessGuard)
	@Post("me/email")
	async addEmail(@Body() dto: UpdateEmailDto, @Req() request: Request) {
		const { userId } = request.user as { userId: string };
		const payload: UpdateEmailInput = {
			userId,
			email: dto.email,
			token: dto.token,
			tokenId: dto.tokenId,
		};

		await this.userService.updateEmail(payload);

		return { message: "common.message.emailAddSuccess" };
	}

	@UseGuards(JwtAccessGuard)
	@Patch("me/email")
	async changeEmail(@Body() dto: UpdateEmailDto, @Req() request: Request) {
		const { userId } = request.user as { userId: string };
		const payload: UpdateEmailInput = {
			userId,
			email: dto.email,
			token: dto.token,
			tokenId: dto.tokenId,
		};

		await this.userService.updateEmail(payload);

		return { message: "common.message.emailChangeSuccess" };
	}

	@Post("reset-password")
	async resetPassword(@Body() dto: ResetPasswordDto) {
		const payload: ResetPasswordInput = {
			tokenId: dto.tokenId,
			token: dto.token,
			newPassword: dto.newPassword,
		};

		await this.userService.resetPassword(payload);

		return { message: "common.message.passwordResetSuccess" };
	}
}
