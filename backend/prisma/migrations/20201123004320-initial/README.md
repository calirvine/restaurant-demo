# Migration `20201123004320-initial`

This migration has been generated by Cal Irvine at 11/22/2020, 7:43:20 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" TEXT NOT NULL,

    FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
)

CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
)

CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201123004320-initial
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,32 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "sqlite"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  id          String @id @default(uuid())
+  email       String @unique
+  password    String
+  created_at  DateTime @default(now())
+  updated_at  DateTime @default(now())
+  profile     Profile
+}
+
+model Profile {
+  id          String @id @default(uuid())
+  name        String
+  role        Int @default(0) // Roles = 0 regular visitor 1 = restaurant owner 2 = Admin
+}
+
+model Restaurant {
+  id          String @id @default(uuid())
+  name        String
+  owner       User
+}
```

