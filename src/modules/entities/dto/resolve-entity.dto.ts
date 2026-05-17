import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum EntityType {
  PERSON  = 'person',
  COMPANY = 'company',
  ACCOUNT = 'account',
}

export class ResolveEntityDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  rfc?: string;

  @IsEnum(EntityType)
  @IsOptional()
  type?: EntityType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  aliases?: string[];

  @IsString()
  @IsOptional()
  fiscalAddress?: string;
}