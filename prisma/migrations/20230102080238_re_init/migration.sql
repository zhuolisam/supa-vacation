-- DropForeignKey
ALTER TABLE "UserFavouriteHomes" DROP CONSTRAINT "UserFavouriteHomes_homeId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavouriteHomes" DROP CONSTRAINT "UserFavouriteHomes_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserFavouriteHomes" ADD CONSTRAINT "UserFavouriteHomes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteHomes" ADD CONSTRAINT "UserFavouriteHomes_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;
