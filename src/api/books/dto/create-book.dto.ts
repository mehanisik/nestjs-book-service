import {
	IsString,
	IsNumber,
	IsOptional,
	Min,
	Max,
	IsUrl,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateBookDto {
	@ApiProperty({
		description: "Title of the book",
		example: "Les Misérables",
	})
	@IsString()
	title: string;

	@ApiProperty({
		description: "Author of the book",
		example: "Victor Hugo",
	})
	@IsString()
	author: string;

	@ApiPropertyOptional({
		description: "A description of the book",
		example:
			"A story of the struggles of an ex-convict, Jean Valjean, in 19th century France.",
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		description: "Published year of the book",
		example: 1925,
		minimum: 1000,
		maximum: new Date().getFullYear(),
	})
	@IsNumber()
	@Min(1000)
	@Max(new Date().getFullYear())
	year: number;

	@ApiPropertyOptional({
		description: "Cover image URL of the book",
		example: "https://example.com/book-cover.jpg",
	})
	@IsUrl()
	@IsOptional()
	coverImageUrl?: string;
}
