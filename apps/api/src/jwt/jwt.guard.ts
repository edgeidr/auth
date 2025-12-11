import { AuthGuard } from "@nestjs/passport";

export class JwtAccessGuard extends AuthGuard("jwt-access") {
	constructor() {
		super();
	}
}

export class JwtRefreshGuard extends AuthGuard("jwt-refresh") {
	constructor() {
		super();
	}
}
