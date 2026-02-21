import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'title precisa ser uma string' })
  @Length(10, 100, { message: 'title precisa ter entre 10 e 100 caracteres' })
  title: string;

  @IsString({ message: 'excerpt precisa ser uma string' })
  @IsNotEmpty({ message: 'excerpt não pode ser vazio' })
  excerpt: string;

  @IsString({ message: 'Conteudo precisa ser uma string' })
  @IsNotEmpty({ message: 'Conteudo não pode ser vazio' })
  content: string;

  @IsOptional()
  @IsString({ message: 'coverImageUrl precisa ser uma string' })
  @IsUrl(
    { require_tld: false },
    { message: 'coverImageUrl precisa ser uma URL válida' },
  )
  coverImageUrl?: string;
}
