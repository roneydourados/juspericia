/*
  Warnings:

  - You are about to drop the `consultation_packets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `consultations_packets_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_consultation_packet_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_consultation_packets` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `value_packet` to the `consultations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "consultations_packets_items" DROP CONSTRAINT "consultations_packets_items_consultation_id_fkey";

-- DropForeignKey
ALTER TABLE "consultations_packets_items" DROP CONSTRAINT "consultations_packets_items_consultation_packet_id_fkey";

-- DropForeignKey
ALTER TABLE "users_consultation_packet_items" DROP CONSTRAINT "users_consultation_packet_items_consultation_id_fkey";

-- DropForeignKey
ALTER TABLE "users_consultation_packet_items" DROP CONSTRAINT "users_consultation_packet_items_user_consultation_packet_i_fkey";

-- DropForeignKey
ALTER TABLE "users_consultation_packets" DROP CONSTRAINT "users_consultation_packets_user_id_fkey";

-- AlterTable
ALTER TABLE "consultations" ADD COLUMN     "value_packet" DECIMAL(18,2) NOT NULL;

-- DropTable
DROP TABLE "consultation_packets";

-- DropTable
DROP TABLE "consultations_packets_items";

-- DropTable
DROP TABLE "users_consultation_packet_items";

-- DropTable
DROP TABLE "users_consultation_packets";
