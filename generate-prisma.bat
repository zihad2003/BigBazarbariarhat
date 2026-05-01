@echo off
set DATABASE_URL=mysql://root:password@localhost:3306/bigbazar_db
call npx prisma generate --schema packages/database/prisma/schema.prisma
