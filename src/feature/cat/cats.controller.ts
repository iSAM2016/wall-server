import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './cat.interface';

@Controller('cats')
export class CatsController {
  // providers 相当于bean
  // 依赖注入
  // 你能发现 Controller 和 Service 处于完全解耦的状态
  // 至少你能发现 Controller 和 Service 处于完全解耦的状态：
  // Controller 做的事情仅仅是接收请求，并在合适的时候调用到 Service，
  // 至于 Service 内部怎么实现的 Controller 完全不在乎。
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}

// @Controller
// public class ItemCatController {
// 	@Autowired
// 	private ItemCatService itemCatService;

// 	@RequestMapping(method = RequestMethod.GET,value="item/cat")
// 	public ResponseEntity<List<ItemCat>> queryItemCatListByParentId(){
// 		try {
// 			ItemCat record = new ItemCat();
// 		    record.setParentId(0L);
// 			List<ItemCat>  list = this.itemCatService.queryListByWhere(record);

// 			if(null == list || list.isEmpty()) {
// 				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
// 			}
// 			return ResponseEntity.ok(list);

// 		} catch (Exception e) {
// 		}
// 		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);

// 	}
