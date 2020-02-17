import { Injectable, Logger } from '@nestjs/common';
import { Cat } from './cat.interface';

/**
 * 相当于bean
 */
@Injectable()
export class CatsService {
  private readonly logger = new Logger(CatsService.name);
  private readonly cats: Cat[] = [{ name: 'ui', age: 124, breed: 'io' }];

  public create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}

// private static final ObjectMapper MAPPER = new ObjectMapper();
// @Service
// public class ContentService  extends BaseService<Content>{
// 	@Autowired
// 	private ContentMapper contentMapper;
// 	public EasyUIResult queryContentList(Long categoryId, Integer page, Integer rows) {
// 		PageHelper.startPage(page,rows);
// 		Example example = new Example(Content.class);
// 		example.setOrderByClause("updated DESC");
// 		example.createCriteria().andEqualTo("categoryId", categoryId);
// 		List<Content> list = this.contentMapper.selectByExample(example);
// 		PageInfo<Content> pageInfo = new PageInfo<Content>(list);
// 		return new  EasyUIResult(pageInfo.getTotal(), pageInfo.getList());
// 	}
