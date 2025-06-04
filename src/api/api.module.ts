import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { BooksModule } from "./books/books.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
	imports: [HealthModule, AuthModule, BooksModule, CloudinaryModule],
})
export class ApiModule {}
