import { registerAs } from "@nestjs/config";
import { AuthConfig } from "./auth-config.type";

export function getAuthConfig(): AuthConfig {
	return {
		jwtSecret: process.env.APP_JWT_SECRET,
		jwtExpiresIn: process.env.APP_JWT_EXPIRES_IN || "1h",
	};
}

export default registerAs<AuthConfig>("auth", () => {
	return getAuthConfig();
});
