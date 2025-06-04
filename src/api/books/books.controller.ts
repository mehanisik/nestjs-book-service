import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Request,
} from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./entities/book.entity";

@ApiTags("Books")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("books")
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Post()
	@ApiOperation({ summary: "Create a new book" })
	@ApiResponse({
		status: 201,
		description: "The book has been successfully created.",
		type: Book,
	})
	@ApiResponse({ status: 400, description: "Bad request." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	create(@Body() createBookDto: CreateBookDto, @Request() req) {
		return this.booksService.create(createBookDto, req.user);
	}

	@Get()
	@ApiOperation({ summary: "Get all books for the authenticated user" })
	@ApiResponse({
		status: 200,
		description: "Return all books for the authenticated user.",
		type: [Book],
	})
	@ApiResponse({ status: 401, description: "Unauthorized." })
	findAll(@Request() req) {
		return this.booksService.findAll(req.user);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get a book by id" })
	@ApiResponse({
		status: 200,
		description: "Return the book.",
		type: Book,
	})
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "Book not found." })
	findOne(@Param("id") id: string, @Request() req) {
		return this.booksService.findOne(id, req.user);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Update a book" })
	@ApiResponse({
		status: 200,
		description: "The book has been successfully updated.",
		type: Book,
	})
	@ApiResponse({ status: 400, description: "Bad request." })
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "Book not found." })
	update(
		@Param("id") id: string,
		@Body() updateBookDto: UpdateBookDto,
		@Request() req,
	) {
		return this.booksService.update(id, updateBookDto, req.user);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete a book" })
	@ApiResponse({
		status: 200,
		description: "The book has been successfully deleted.",
	})
	@ApiResponse({ status: 401, description: "Unauthorized." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	@ApiResponse({ status: 404, description: "Book not found." })
	remove(@Param("id") id: string, @Request() req) {
		return this.booksService.remove(id, req.user);
	}
}
