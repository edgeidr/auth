import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserAuthStateModule } from "../user-auth-state/user-auth-state.module";

@Module({
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
	imports: [UserAuthStateModule],
})
export class UserModule {}
