import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { BooksModule } from "./books/books.module";

@Module({
	imports: [HealthModule, AuthModule, BooksModule],
})
export class ApiModule {}
