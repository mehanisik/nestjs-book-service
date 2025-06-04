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
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
	HttpCode,
	HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
	ApiConsumes,
	ApiBody,
	ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./entities/book.entity";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { memoryStorage } from "multer";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = /(jpg|jpeg|png)$/;

@ApiTags("Books")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("books")
export class BooksController {
	constructor(
		private readonly booksService: BooksService,
		private readonly cloudinaryService: CloudinaryService,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: "Create a new book",
		description:
			"Creates a new book with optional cover image. The image will be uploaded to Cloudinary and the URL will be stored.",
	})
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			required: ["title", "author", "year"],
			properties: {
				title: {
					type: "string",
					example: "The Great Gatsby",
					description: "The title of the book",
				},
				author: {
					type: "string",
					example: "F. Scott Fitzgerald",
					description: "The author of the book",
				},
				description: {
					type: "string",
					example: "A story of the American Dream in the 1920s",
					description: "A brief description or summary of the book",
				},
				year: {
					type: "number",
					example: 1925,
					description: "The year the book was published",
				},
				coverImage: {
					type: "string",
					format: "binary",
					description:
						"Book cover image (JPG, JPEG, or PNG, max 5MB). The image will be resized to 500x500 pixels while maintaining aspect ratio.",
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor("coverImage", { storage: memoryStorage() }))
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "The book has been successfully created.",
		type: Book,
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Invalid input data or file format/size.",
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "User is not authenticated.",
	})
	async create(
		@Body() createBookDto: CreateBookDto,
		@Request() req,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT }),
					new FileTypeValidator({ fileType: ALLOWED_FILE_TYPES }),
				],
				fileIsRequired: false,
			}),
		)
		file?: Express.Multer.File,
	) {
		const coverImageUrl = file
			? await this.cloudinaryService.uploadImage(file)
			: undefined;
		return this.booksService.create(
			{ ...createBookDto, coverImageUrl },
			req.user,
		);
	}

	@Get()
	@ApiOperation({
		summary: "Get all books",
		description: "Retrieves all books for the authenticated user.",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Returns an array of books.",
		type: [Book],
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "User is not authenticated.",
	})
	findAll(@Request() req) {
		return this.booksService.findAll(req.user);
	}

	@Get(":id")
	@ApiOperation({
		summary: "Get a book by ID",
		description:
			"Retrieves a specific book by its ID. The book must belong to the authenticated user.",
	})
	@ApiParam({
		name: "id",
		description: "The ID of the book to retrieve",
		type: "string",
		format: "uuid",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Returns the requested book.",
		type: Book,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Book not found.",
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "User is not authenticated.",
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: "User does not have access to this book.",
	})
	findOne(@Param("id") id: string, @Request() req) {
		return this.booksService.findOne(id, req.user);
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Update a book",
		description:
			"Updates a book's information and/or cover image. The image will be uploaded to Cloudinary and the URL will be updated.",
	})
	@ApiParam({
		name: "id",
		description: "The ID of the book to update",
		type: "string",
		format: "uuid",
	})
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				title: {
					type: "string",
					example: "The Great Gatsby (Updated)",
					description: "The updated title of the book",
				},
				author: {
					type: "string",
					example: "F. Scott Fitzgerald",
					description: "The updated author of the book",
				},
				description: {
					type: "string",
					example: "An updated description of the American Dream in the 1920s",
					description: "The updated description or summary of the book",
				},
				year: {
					type: "number",
					example: 1925,
					description: "The updated publication year",
				},
				coverImage: {
					type: "string",
					format: "binary",
					description:
						"New book cover image (JPG, JPEG, or PNG, max 5MB). The image will be resized to 500x500 pixels while maintaining aspect ratio.",
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor("coverImage", { storage: memoryStorage() }))
	@ApiResponse({
		status: HttpStatus.OK,
		description: "The book has been successfully updated.",
		type: Book,
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Invalid input data or file format/size.",
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Book not found.",
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "User is not authenticated.",
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: "User does not have access to this book.",
	})
	async update(
		@Param("id") id: string,
		@Body() updateBookDto: UpdateBookDto,
		@Request() req,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT }),
					new FileTypeValidator({ fileType: ALLOWED_FILE_TYPES }),
				],
				fileIsRequired: false,
			}),
		)
		file?: Express.Multer.File,
	) {
		const coverImageUrl = file
			? await this.cloudinaryService.uploadImage(file)
			: undefined;
		return this.booksService.update(
			id,
			{ ...updateBookDto, coverImageUrl },
			req.user,
		);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: "Delete a book",
		description:
			"Deletes a book and its associated cover image from Cloudinary.",
	})
	@ApiParam({
		name: "id",
		description: "The ID of the book to delete",
		type: "string",
		format: "uuid",
	})
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: "The book has been successfully deleted.",
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Book not found.",
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "User is not authenticated.",
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: "User does not have access to this book.",
	})
	async remove(@Param("id") id: string, @Request() req) {
		await this.booksService.remove(id, req.user);
	}
}
