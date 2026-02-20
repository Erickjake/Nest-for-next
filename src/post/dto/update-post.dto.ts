import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(
  PickType(CreatePostDto, ['content', 'excerpt', 'coverImageUrl', 'title']),
) {
  @IsOptional()
  @IsBoolean({ message: 'Campo "published" deve ser um booleano' })
  published?: boolean;
}
