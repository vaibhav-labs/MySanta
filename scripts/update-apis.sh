#!/bin/bash

# This script updates all API files to use Supabase instead of Prisma

FILES=(
  "app/api/profile/route.ts"
  "app/api/feedback/route.ts"
  "app/api/stats/route.ts"
  "app/api/lists/[listId]/route.ts"
  "app/api/lists/[listId]/items/route.ts"
  "app/api/items/[itemId]/route.ts"
  "app/api/items/[itemId]/hold/route.ts"
  "app/api/items/[itemId]/purchase/route.ts"
  "app/api/items/[itemId]/block/route.ts"
  "app/api/social/friends/route.ts"
  "app/api/social/friends/[friendshipId]/route.ts"
  "app/api/social/activity/route.ts"
  "app/api/search/route.ts"
  "app/api/friends/details/route.ts"
  "app/api/admin/users/[userId]/route.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    # Replace prisma import with db import
    sed -i '' 's/import { prisma } from "@\/lib\/prisma"/import { db } from "@\/lib\/db"/' "$file"
    # Replace prisma. with db.
    sed -i '' 's/prisma\./db\./g' "$file"
    # Fix common patterns
    sed -i '' 's/db\.user\.findUnique/db.user.findByEmail/g' "$file"
    sed -i '' 's/db\.user\.findMany/db.user.findMany/g' "$file"
    sed -i '' 's/db\.event\.findMany/db.event.findMany/g' "$file"
    sed -i '' 's/db\.list\.findMany/db.list.findMany/g' "$file"
    sed -i '' 's/db\.listItem\.findMany/db.listItem.findMany/g' "$file"
    sed -i '' 's/db\.feedback\.findMany/db.feedback.findMany/g' "$file"
    sed -i '' 's/db\.friendship\.findMany/db.friendship.findMany/g' "$file"
    sed -i '' 's/db\.socialActivity\.findMany/db.socialActivity.findMany/g' "$file"
    sed -i '' 's/db\.\$transaction/transaction/g' "$file"
  fi
done

echo "All files updated!"