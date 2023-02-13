import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  published: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @IsString()
  @IsNotEmpty()
  authorId: string;
}
