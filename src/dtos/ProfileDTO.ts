export type ProfileDTO = {
  name: string;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  oldPassword?: string | null;
};
