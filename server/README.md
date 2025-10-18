## Prisma

### Schema

The schemas are defined under `server/prisma`

### Migrations

We need to run the command below for adding new migrations.

```sh
pnpm dlx prisma migrate dev --name init
```

### Dashboard

We can use the built-in command below to open the Prisma dashboard.

```sh
pnpm dlx prisma studio
```

### Client

After making changes to your schema.prisma file and running npx prisma migrate dev (or prisma db push), you need to generate the Prisma Client. This command creates a type-safe client library that's tailored to your database schema.

```sh
pnpm dlx prisma generate
```