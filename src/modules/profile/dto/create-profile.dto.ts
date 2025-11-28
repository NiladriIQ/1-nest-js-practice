import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProfileDto {
    @IsString({ message: 'First Name must be a string' })
    @IsOptional()
    @MinLength(3, { message: 'First Name must be at least 3 characters long' })
    @MaxLength(100)
    firstName?: string;

    @IsString({ message: 'Last Name must be a string' })
    @IsOptional()
    @MinLength(3, { message: 'Last Name must be at least 3 characters long' })
    @MaxLength(100)
    lastName?: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    gender?: string;

    @IsDate()
    @IsOptional()
    dateOfBirth?: Date;

    @IsString()
    @IsOptional()
    bio?: string;
    
    @IsString()
    @IsOptional()
    profileImage?: string;
}
