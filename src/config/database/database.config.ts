import { registerAs } from "@nestjs/config";
import { DatabaseConfig } from "./database-config.type";

export function getDatabaseConfig(): DatabaseConfig {
	return {
		url: process.env.DATABASE_URL,
		type: "postgres",
		ssl: process.env.NODE_ENV === "production",
		synchronize: process.env.NODE_ENV !== "production",
		entities: ["dist/**/*.entity{.ts,.js}"],
	};
}

export default registerAs<DatabaseConfig>("database", () => {
	return getDatabaseConfig();
});
