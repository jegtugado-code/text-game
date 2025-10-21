export interface EnvConfigType {
  nodeEnv: string;
  port: number;
  jwt: {
    secret: string;
    issuer: string;
    audience: string;
    expiresIn: number;
  };
  databaseUrl: string;
}

export const EnvConfig: EnvConfigType = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) ?? 3009,
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    issuer: process.env.JWT_ISSUER ?? '',
    audience: process.env.JWT_AUDIENCE ?? '',
    expiresIn: Number(process.env.JWT_EXPIRES_IN) ?? 3600,
  },
  databaseUrl: process.env.DATABASE_URL ?? '',
};
