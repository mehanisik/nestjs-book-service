import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { BooksController } from "./books.controller";
import { BooksService } from "./books.service";
import { Book } from "./entities/book.entity";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Module({
	imports: [TypeOrmModule.forFeature([Book]), ConfigModule],
	controllers: [BooksController],
	providers: [BooksService, CloudinaryService],
})
export class BooksModule {}
