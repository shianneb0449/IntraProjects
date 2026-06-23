export interface AppUserDto {
  userId: number; samAccountName: string; displayName: string;
  email: string; department: string | null; roles: string[];
}
export interface CurrentUserDto extends AppUserDto { token: string; }
