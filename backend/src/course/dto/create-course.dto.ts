import { IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  tenantId: string;

  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  lecturerId: string;
}
