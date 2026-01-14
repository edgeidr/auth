import { Body, Controller, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateMyProfileDto } from "./dto/update-my-profile.dto";
import { Request } from "express";
import { JwtAccessGuard } from "../jwt/jwt.guard";
import { UpdateUserProfileInput } from "./inputs/update-user-profile.input";
import { AddEmailDto } from "./dto/add-email.dto.";
import { AddEmailInput } from "./inputs/add-email.input";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ResetPasswordInput } from "./inputs/reset-password.input";

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
	@Post("me/email/add")
	async addEmail(@Body() dto: AddEmailDto, @Req() request: Request) {
		const { userId } = request.user as { userId: string };
		const payload: AddEmailInput = {
			userId,
			email: dto.email,
			token: dto.token,
			tokenId: dto.tokenId,
		};

		await this.userService.addEmail(payload);

		return { message: "common.message.emailAddSuccess" };
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
