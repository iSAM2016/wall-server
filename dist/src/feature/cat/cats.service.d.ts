import { Cat } from './cat.interface';
export declare class CatsService {
    private readonly logger;
    private readonly cats;
    create(cat: Cat): void;
    findAll(): Cat[];
}
