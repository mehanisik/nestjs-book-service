import {
	Injectable,
	NotFoundException,
	ForbiddenException,
	Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "./entities/book.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { User } from "../auth/entities/user.entity";

@Injectable()
export class BooksService {
	private readonly logger = new Logger(BooksService.name);

	constructor(
		@InjectRepository(Book)
		private readonly bookRepository: Repository<Book>,
	) {}

	async create(createBookDto: CreateBookDto, user: User): Promise<Book> {
		this.logger.debug(
			`Creating new book for user ${user.id}: ${createBookDto.title}`,
		);
		const book = this.bookRepository.create({
			...createBookDto,
			userId: user.id,
		});
		const savedBook = await this.bookRepository.save(book);
		this.logger.log(`Book created successfully: ${savedBook.id}`);
		return savedBook;
	}

	async findAll(user: User): Promise<Book[]> {
		this.logger.debug(`Fetching all books for user ${user.id}`);
		const books = await this.bookRepository.find({
			where: { userId: user.id },
			order: { createdAt: "DESC" },
		});
		this.logger.log(`Found ${books.length} books for user ${user.id}`);
		return books;
	}

	async findOne(id: string, user: User): Promise<Book> {
		this.logger.debug(`Fetching book ${id} for user ${user.id}`);
		const book = await this.bookRepository.findOne({
			where: { id },
		});

		if (!book) {
			this.logger.warn(`Book not found: ${id}`);
			throw new NotFoundException(`Book with ID ${id} not found`);
		}

		if (book.userId !== user.id) {
			this.logger.warn(
				`Access denied: User ${user.id} tried to access book ${id} owned by ${book.userId}`,
			);
			throw new ForbiddenException("You don't have access to this book");
		}

		this.logger.log(`Book ${id} retrieved successfully`);
		return book;
	}

	async update(
		id: string,
		updateBookDto: UpdateBookDto,
		user: User,
	): Promise<Book> {
		this.logger.debug(`Updating book ${id} for user ${user.id}`);
		const book = await this.findOne(id, user);
		Object.assign(book, updateBookDto);
		const updatedBook = await this.bookRepository.save(book);
		this.logger.log(`Book ${id} updated successfully`);
		return updatedBook;
	}

	async remove(id: string, user: User): Promise<void> {
		this.logger.debug(`Removing book ${id} for user ${user.id}`);
		const book = await this.findOne(id, user);
		await this.bookRepository.remove(book);
		this.logger.log(`Book ${id} removed successfully`);
	}
}
