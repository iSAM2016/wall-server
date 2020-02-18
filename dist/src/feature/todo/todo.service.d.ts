import { Repository } from 'typeorm';
import { Todo, User } from '../../entity';
import { CreateTodoDto } from './dto/createTodo.dto';
export declare class TodoService {
    private readonly todoRepository;
    constructor(todoRepository: Repository<Todo>);
    create(body: CreateTodoDto, authUser: User): Promise<Todo>;
}
