import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserAuthStateModule } from "../user-auth-state/user-auth-state.module";
import { TokenModule } from "../token/token.module";

@Module({
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
	imports: [UserAuthStateModule, TokenModule],
})
export class UserModule {}
