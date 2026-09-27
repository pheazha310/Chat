import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

function port(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Environment variable ${name} must be a valid port`);
  }
  return value;
}

export const env = {
  port: port("PORT", 5000),
  database: {
    host: required("DB_HOST", "localhost"),
    port: port("DB_PORT", 3306),
    user: required("DB_USER", "root"),
    password: process.env.DB_PASSWORD ?? "",
    name: required("DB_NAME", "chat_app"),
  },
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: required("JWT_EXPIRES_IN", "1d"),
};
