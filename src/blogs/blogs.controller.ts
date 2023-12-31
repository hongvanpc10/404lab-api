import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlogsService } from './blogs.service';
import CreateBlogDto from './dto/createBlog.dto';
import UpdateBlogDto from './dto/updateBlog.dto';
import { PaginationOptions } from 'src/utils/paginate';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @UseGuards(AuthGuard)
  @Post()
  createBlog(@Body() createBlogDto: CreateBlogDto, @Req() request) {
    return this.blogsService.createBlog(request.user.id, createBlogDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateBlog(
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() request,
    @Param('id') id: string,
  ) {
    return this.blogsService.updateBlog(id, request.user, updateBlogDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteBlog(@Param('id') id: string, @Req() request) {
    return this.blogsService.deleteBlog(id, request.user);
  }

  @Get(':slug')
  getBlog(@Param('slug') slug: string) {
    return this.blogsService.getBlog(slug);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getBlogs(@Query() { limit, order, page, sort }: PaginationOptions) {
    return this.blogsService.getBlogs({ limit, order, page, sort });
  }

  @Get('tag/:tag')
  @UsePipes(new ValidationPipe({ transform: true }))
  getBlogsByTag(
    @Param('tag') tag: string,
    @Query() { limit, order, page, sort }: PaginationOptions,
  ) {
    return this.blogsService.getBlogsByTag(tag, { limit, order, page, sort });
  }

  @Get('user/:user')
  @UsePipes(new ValidationPipe({ transform: true }))
  getBlogsByUser(
    @Param('user') user: string,
    @Query() { limit, order, page, sort }: PaginationOptions,
  ) {
    return this.blogsService.getBlogsByUser(user, { limit, order, page, sort });
  }
}
