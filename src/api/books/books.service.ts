import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "./entities/book.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { User } from "../auth/entities/user.entity";

@Injectable()
export class BooksService {
	constructor(
		@InjectRepository(Book)
		private readonly bookRepository: Repository<Book>,
	) {}

	async create(createBookDto: CreateBookDto, user: User): Promise<Book> {
		const book = this.bookRepository.create({
			...createBookDto,
			userId: user.id,
		});
		return this.bookRepository.save(book);
	}

	async findAll(user: User): Promise<Book[]> {
		return this.bookRepository.find({
			where: { userId: user.id },
			order: { createdAt: "DESC" },
		});
	}

	async findOne(id: string, user: User): Promise<Book> {
		const book = await this.bookRepository.findOne({
			where: { id },
		});

		if (!book) {
			throw new NotFoundException(`Book with ID ${id} not found`);
		}

		if (book.userId !== user.id) {
			throw new ForbiddenException("You don't have access to this book");
		}

		return book;
	}

	async update(
		id: string,
		updateBookDto: UpdateBookDto,
		user: User,
	): Promise<Book> {
		const book = await this.findOne(id, user);
		Object.assign(book, updateBookDto);
		return this.bookRepository.save(book);
	}

	async remove(id: string, user: User): Promise<void> {
		const book = await this.findOne(id, user);
		await this.bookRepository.remove(book);
	}
}
