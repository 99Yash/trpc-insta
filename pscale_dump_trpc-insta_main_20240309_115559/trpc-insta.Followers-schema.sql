CREATE TABLE `Followers` (
  `followingId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `followerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `Followers_followingId_key` (`followingId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
