# Migration `20201126145003-add-restaurant-description`

This migration has been generated by Cal Irvine at 11/26/2020, 9:50:03 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);
INSERT INTO "new_Restaurant" ("id", "name", "userId") SELECT "id", "name", "userId" FROM "Restaurant";
DROP TABLE "Restaurant";
ALTER TABLE "new_Restaurant" RENAME TO "Restaurant";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201126023825-make-profile-optional..20201126145003-add-restaurant-description
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -27,8 +27,9 @@
 model Restaurant {
   id          String @id @default(uuid())
   name        String
+  description String
   owner       User
 }
 model Review {
```


