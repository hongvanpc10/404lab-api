import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlogsService } from './blogs.service';
import CreateBlogDto from './dto/createBlog.dto';
import UpdateBlogDto from './dto/updateBlog.dto';

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
}
