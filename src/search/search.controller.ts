import { Controller, Get, Query } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller('search')
export class SearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Get()
  async search(@Query('query') query: string) {
    return await this.elasticsearchService.search({
      query: {
        match_all: {},
      },
    });
  }
}
