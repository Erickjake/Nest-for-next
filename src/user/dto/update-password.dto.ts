import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'senha precisa ser uma string' })
  @IsNotEmpty({ message: 'senha não pode estar vazia' })
  currentPassword: string;

  @IsString({ message: 'Nova senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Nova senha não pode estar vazia' })
  @MinLength(6, {
    message: 'Nova senha não deve ter um mínimo de 6 caracteres',
  })
  newPassword: string;
}
