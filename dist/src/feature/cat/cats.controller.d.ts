import { CreateCatDto } from './dto/cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './cat.interface';
import { Request } from 'express';
export declare class CatsController {
    private readonly catsService;
    constructor(catsService: CatsService);
    create(createCatDto: CreateCatDto): Promise<void>;
    findAll(req: Request): Promise<Cat[]>;
}
