import { Module } from "@nestjs/common";
import { UserAuthStateService } from "./user-auth-state.service";

@Module({
	providers: [UserAuthStateService],
	exports: [UserAuthStateService],
})
export class UserAuthStateModule {}
