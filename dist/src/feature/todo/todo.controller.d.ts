import { CreateTodoDto } from './dto/createTodo.dto';
import { User, Todo } from '@entity';
import { TodoService } from './todo.service';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    create(body: CreateTodoDto, authUser: User): Promise<Todo>;
}
