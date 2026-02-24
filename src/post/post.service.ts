import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { createSlugFromText } from 'src/common/utils/create-slug-from-text';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async findOne(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: ['author'],
    });
    return post;
  }

  async findAllOwned(author: User) {
    const posts = await this.postRepository.find({
      where: {
        author: {
          id: author.id,
        },
      },
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
    return posts;
  }
  async findAll(postData: Partial<Post>) {
    const posts = await this.postRepository.find({
      where: postData,
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
    return posts;
  }
  async findOneOwned(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: {
        ...postData,
        author: {
          id: author.id,
        },
      },
      relations: ['author'],
    });
    return post;
  }
  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postData, author);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: createSlugFromText(dto.title),
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImageUrl: dto.coverImageUrl,
      author,
    });
    const savedPost = await this.postRepository
      .save(post)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          this.logger.error(`Error saving post: ${err.message}`);
        }
        throw new BadGatewayException('Error saving post');
      });
    return savedPost;
  }

  async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
    if (Object.keys(dto).length === 0) {
      throw new BadGatewayException('Dados inválidos');
    }
    const post = await this.findOneOwnedOrFail(postData, author);

    post.title = dto.title ?? post.title;
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.content = dto.content ?? post.content;
    post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;
    post.published = dto.published ?? post.published;

    return this.postRepository.save(post);
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOneOrFail(postData);
    await this.postRepository.delete({
      ...postData,
      author: {
        id: author.id,
      },
    });
    return post;
  }
}
