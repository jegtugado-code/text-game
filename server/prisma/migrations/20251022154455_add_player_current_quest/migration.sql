-- AlterTable
ALTER TABLE "Player" ADD COLUMN "currentQuest" TEXT NOT NULL DEFAULT 'intro';
ALTER TABLE "Player" ALTER COLUMN "currentChapter" SET DEFAULT 'intro';
