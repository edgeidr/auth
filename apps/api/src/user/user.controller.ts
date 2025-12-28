import { Body, Controller, Patch, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateMyProfileDto } from "./dto/update-my-profile.dto";
import { Request } from "express";
import { JwtAccessGuard } from "../jwt/jwt.guard";
import { UpdateUserProfileInput } from "./inputs/update-user-profile.input";

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
}
