/*
  Warnings:

  - Added the required column `file_server_name` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "file_server_name" VARCHAR(300) NOT NULL;
