import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import Role from 'src/roles/role.enum';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  createTag(@Body() { name }: { name: string }) {
    return this.tagsService.createTag(name);
  }

  @Get()
  getAllTags() {
    return this.tagsService.getAllTags();
  }
}
