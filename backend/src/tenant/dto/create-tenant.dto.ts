import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsString()
  domain: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;
}
