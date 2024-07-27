export enum UserRole {
  ADMIN = 'admin',
  TUTOR = 'tutor',
  NON_VERIFIED = 'non-verified',
}

export class User {
  constructor(
    public id: string | null,
    public name: string,
    public email: string,
    public role: UserRole,
  ) {}

  static fromMap(data: Record<string, any>, id: string) {
    return new User(
      id, 
      data.name,
      data.email,
      data.role
    );
  }

    toMap(): Record<string, any> {
        return {
            name: this.name,
            email: this.email,
            role: this.role,
        };
    }
}