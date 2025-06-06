import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { Config } from "@/config/config.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: AuthService,
		private readonly configService: ConfigService<Config>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>("auth.jwtSecret", { infer: true }),
		});
	}

	public async validate(payload: { sub: string; email: string }) {
		const user = await this.userService.findById(payload.sub);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
