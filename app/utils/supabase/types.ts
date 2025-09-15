export interface CookieOptions {
  [key: string]: unknown;
}

export interface CookieItem {
  name: string;
  value: string;
  options?: CookieOptions;
}

export interface CookiesHandler {
  getAll(): CookieItem[];
  setAll(cookiesToSet: CookieItem[]): void;
}
