CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`priceAmount` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stocks` (
	`id` text PRIMARY KEY NOT NULL,
	`quantityAvailable` integer NOT NULL,
	`bookId` text NOT NULL,
	`status` text DEFAULT 'OutOfStock' NOT NULL,
	FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stocks_bookId_unique` ON `stocks` (`bookId`);