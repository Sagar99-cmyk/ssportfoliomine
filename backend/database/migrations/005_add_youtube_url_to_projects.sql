-- ==============================================================================
-- Migration: 005_add_youtube_url_to_projects.sql
-- Description: Adds optional youtube_url column to projects table
-- ==============================================================================

ALTER TABLE `projects` ADD COLUMN `youtube_url` TEXT DEFAULT NULL AFTER `linkedin_url`;

