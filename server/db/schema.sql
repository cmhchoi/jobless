DROP DATABASE IF EXISTS job;

CREATE DATABASE job;

USE job;

CREATE TABLE `user` (
  `id` INTEGER AUTO_INCREMENT,
  `username` INTEGER NULL DEFAULT NULL,
  `email` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`) 
);
    
CREATE TABLE `events` (
  `id` INTEGER AUTO_INCREMENT,
  `description` INTEGER NULL DEFAULT NULL,
  `date` INTEGER NULL DEFAULT NULL,
  `id_user` INTEGER NULL DEFAULT NULL,
  `id_position` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`) 
);
    
CREATE TABLE `position` (
  `id` INTEGER AUTO_INCREMENT,
  `title` INTEGER NULL DEFAULT NULL,
  `company` INTEGER NULL DEFAULT NULL,
  `description` INTEGER NULL DEFAULT NULL,
  `id_user` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`) 
);

ALTER TABLE `events` ADD FOREIGN KEY (id_user) REFERENCES `user` (`id`);
ALTER TABLE `events` ADD FOREIGN KEY (id_position) REFERENCES `position` (`id`);
ALTER TABLE `position` ADD FOREIGN KEY (id_user) REFERENCES `user` (`id`);