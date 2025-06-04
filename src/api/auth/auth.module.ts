import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Config } from "../../config/config.type";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { User } from "./entities/user.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService<Config>) => ({
				secret: configService.getOrThrow("auth.jwtSecret", { infer: true }),
				signOptions: {
					expiresIn: configService.getOrThrow("auth.jwtExpiresIn", {
						infer: true,
					}),
				},
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
