import * as _ from 'lodash';
import * as moment from 'moment';
import { Cron } from '@nestjs/schedule';
import { UvService } from '../../uv/uv.service';
import {
  UNIT,
  DISPLAY_BY_MINUTE,
  DATABASE_BY_UNIT,
  COMMAND_ARGUMENT_BY_MONTH,
  COMMAND_ARGUMENT_BY_HOUR,
  COMMAND_ARGUMENT_BY_DAY,
} from '@utils';
import { Injectable, Logger } from '@nestjs/common';
import {
  ProjectService,
  UniqueViewService,
  CityDistributionService,
} from '../../shard';
/**
 *  按月统计系统分布
 */
@Injectable()
export class SummaryUvService {}
