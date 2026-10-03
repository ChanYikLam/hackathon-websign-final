-- ============================================================
-- SoloPilot Database Schema
-- ⚠️  This is the SINGLE SOURCE OF TRUTH for database schema.
--     Do NOT create duplicate schema files.
--     Use `npm run db:init` to initialize from this file.
-- Version: 1.1
-- Database: MySQL 8.0+ / MariaDB 10.5+
-- Character Set: utf8mb4
-- Description: Complete database schema for SoloPilot
--              AI-driven one-person company startup assistant
-- ============================================================

CREATE DATABASE IF NOT EXISTS `solopilot_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `solopilot_db`;

-- ============================================================
-- 1. Users Table - User authentication and basic information
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`                  BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `username`            VARCHAR(50)       NOT NULL,
  `password_hash`       VARCHAR(255)      NOT NULL,
  `nickname`            VARCHAR(50)       DEFAULT NULL,
  `avatar`              VARCHAR(500)      DEFAULT NULL,
  `status`              TINYINT           NOT NULL DEFAULT 1 COMMENT '1=active, 0=disabled',
  `role`                VARCHAR(20)        NOT NULL DEFAULT 'user' COMMENT 'user or admin',
  `is_info_completed`   TINYINT(1)        NOT NULL DEFAULT 0,
  `is_mbti_completed`   TINYINT(1)        NOT NULL DEFAULT 0,
  `is_analysis_done`    TINYINT(1)        NOT NULL DEFAULT 0,
  `failed_login_count`  TINYINT           NOT NULL DEFAULT 0,
  `locked_until`        DATETIME          DEFAULT NULL COMMENT 'Account lock expiration time',
  `last_login_at`       DATETIME          DEFAULT NULL,
  `created_at`          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User main table - authentication and basic status';

-- ============================================================
-- 2. User Profiles Table - User portrait and assessment results
-- ============================================================
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id`                  BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`             BIGINT UNSIGNED   NOT NULL,
  
  -- Info collection (7 steps)
  `city`                VARCHAR(20)       DEFAULT NULL COMMENT 'City level: 一线/新一线/二线/三线',
  `gender`              VARCHAR(10)       DEFAULT NULL COMMENT 'Male/Female/skip',
  `intensity`           VARCHAR(20)       DEFAULT NULL COMMENT 'Work intensity: 007/996/965/越少工作越好',
  `skill`               VARCHAR(50)       DEFAULT NULL COMMENT 'Core skill',
  `direction`           VARCHAR(100)      DEFAULT NULL COMMENT 'Business direction preference',
  `purpose`             VARCHAR(200)      DEFAULT NULL COMMENT 'Purpose of starting one-person company',
  `schedule`            VARCHAR(50)       DEFAULT NULL COMMENT 'Work time preference',
  `skill_other`         VARCHAR(50)       DEFAULT NULL COMMENT 'Custom skill description when skill=其他',
  
  -- MBTI assessment
  `mbti_type`           VARCHAR(4)        DEFAULT NULL COMMENT 'ENFP, INTJ, etc.',
  `mbti_scores`         JSON              DEFAULT NULL COMMENT '{"E":14,"I":7,"S":10,"N":57,"T":30,"F":37,"J":22,"P":45}',
  `mbti_description`    TEXT              DEFAULT NULL COMMENT 'MBTI type description',
  `mbti_strengths`      JSON              DEFAULT NULL COMMENT 'Array of entrepreneurship strengths',
  `mbti_blind_spots`    JSON              DEFAULT NULL COMMENT 'Array of entrepreneurship blind spots',
  `mbti_suitable_dirs`  JSON              DEFAULT NULL COMMENT 'Array of suitable directions',
  `mbti_completed_at`   DATETIME          DEFAULT NULL,
  
  -- AI Team assessment
  `ai_team_plan_type`   VARCHAR(1)        DEFAULT NULL COMMENT 'Plan type: A/B/C/D/E/F',
  `ai_team_plan_name`   VARCHAR(50)       DEFAULT NULL COMMENT 'Plan name',
  `ai_team_roles`       JSON              DEFAULT NULL COMMENT 'Array of recommended roles',
  `ai_team_completed_at` DATETIME         DEFAULT NULL,
  
  -- Derived fields
  `personality_tags`    JSON              DEFAULT NULL COMMENT 'User profile tags array',
  `interests`           JSON              DEFAULT NULL COMMENT 'Interest areas array',
  `communication_style` VARCHAR(50)       DEFAULT NULL,
  `total_messages`      INT               NOT NULL DEFAULT 0,
  `total_tokens`        BIGINT            NOT NULL DEFAULT 0,
  `avg_session_len`     INT               DEFAULT 0,
  `last_analyzed_at`    DATETIME          DEFAULT NULL,
  `profile_summary`     TEXT              DEFAULT NULL,
  
  `version`             INT               NOT NULL DEFAULT 1 COMMENT 'Optimistic lock version',
  `created_at`          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_mbti_type` (`mbti_type`),
  KEY `idx_ai_team_plan` (`ai_team_plan_type`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User profiles - info collection, MBTI, AI team results';

-- ============================================================
-- 3. Info Collection Answers Table - Step-by-step answers
-- ============================================================
CREATE TABLE IF NOT EXISTS `info_collect_answers` (
  `id`          BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED   NOT NULL,
  `step`        TINYINT           NOT NULL COMMENT 'Step number 1-7',
  `field`       VARCHAR(50)       NOT NULL COMMENT 'Field name: city/gender/intensity/etc.',
  `value`       VARCHAR(200)      NOT NULL COMMENT 'User answer value',
  `created_at`  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_step` (`user_id`, `step`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_answer_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Info collection step-by-step answers for resume support';

-- ============================================================
-- 4. Analysis Tasks Table - Async AI analysis task tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS `analysis_tasks` (
  `id`              BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `task_id`         VARCHAR(50)       NOT NULL COMMENT 'Unique task identifier',
  `user_id`         BIGINT UNSIGNED   NOT NULL,
  `status`          VARCHAR(20)       NOT NULL DEFAULT 'queued' COMMENT 'queued/processing/completed/failed',
  `progress`        TINYINT           NOT NULL DEFAULT 0 COMMENT 'Progress percentage 0-100',
  `error_detail`    TEXT              DEFAULT NULL COMMENT 'Error message if failed',
  `estimated_time`  INT               DEFAULT NULL COMMENT 'Estimated time in seconds',
  `started_at`      DATETIME          DEFAULT NULL,
  `completed_at`    DATETIME          DEFAULT NULL,
  `created_at`      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_task_id` (`task_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_task_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Async AI analysis task status tracking';

-- ============================================================
-- 5. Analysis Results Table - LLM generated analysis results
-- ============================================================
CREATE TABLE IF NOT EXISTS `analysis_results` (
  `id`              BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`         BIGINT UNSIGNED   NOT NULL,
  `task_id`         VARCHAR(50)       NOT NULL COMMENT 'Associated task ID',
  
  -- Structured result fields
  `profile_tags`    JSON              DEFAULT NULL COMMENT 'User profile tags array',
  `profile_desc`    TEXT              DEFAULT NULL COMMENT 'User description paragraph',
  `directions`      JSON              DEFAULT NULL COMMENT 'Array of recommended directions with rank, name, match_rate, reason, income_range, case_brief, startup_tips',
  `user_type`       VARCHAR(20)       DEFAULT NULL COMMENT '保守型/平衡型/激进型',
  `user_type_label` VARCHAR(50)       DEFAULT NULL COMMENT 'User type label',
  `user_type_desc`  TEXT              DEFAULT NULL COMMENT 'User type description',
  `user_type_strategy` TEXT           DEFAULT NULL COMMENT 'Strategy advice for user type',
  
  -- Summary
  `summary_profile`       TEXT        DEFAULT NULL COMMENT 'Your profile summary',
  `summary_directions`    TEXT        DEFAULT NULL COMMENT 'Recommended directions',
  `summary_strategy`      TEXT        DEFAULT NULL COMMENT 'Strategy advice',
  `summary_city_advice`   TEXT        DEFAULT NULL COMMENT 'City-specific advice',
  `summary_checklist`     JSON        DEFAULT NULL COMMENT 'First month checklist array',
  `summary_timeline`      TEXT        DEFAULT NULL COMMENT 'Expected timeline',
  
  `generated_at`    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at`      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_task_id` (`task_id`),
  CONSTRAINT `fk_result_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='LLM generated personalized analysis results';

-- ============================================================
-- 6. User Feedback Table - User satisfaction feedback
-- ============================================================
CREATE TABLE IF NOT EXISTS `user_feedback` (
  `id`                  BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`             BIGINT UNSIGNED   NOT NULL,
  `rating`              TINYINT           NOT NULL COMMENT 'Satisfaction rating 1-5',
  `comment`             VARCHAR(500)      DEFAULT NULL COMMENT 'Open-ended feedback text',
  `direction_preference` VARCHAR(20)      DEFAULT NULL COMMENT 'Whether wants to explore other directions: 是/否/不确定',
  `created_at`          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_rating` (`rating`),
  CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_rating` CHECK (`rating` >= 1 AND `rating` <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User satisfaction feedback (max 5 per user)';

-- ============================================================
-- 7. AI Team Answers Table - AI employee selection assessment
-- ============================================================
CREATE TABLE IF NOT EXISTS `ai_team_answers` (
  `id`              BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`         BIGINT UNSIGNED   NOT NULL,
  `answers`         JSON              NOT NULL COMMENT '{"1":"A","2":"B",...} - 10 question answers',
  `plan_type`       VARCHAR(1)        DEFAULT NULL COMMENT 'Matched plan type A-F',
  `plan_name`       VARCHAR(50)       DEFAULT NULL COMMENT 'Plan name',
  `plan_description` TEXT             DEFAULT NULL COMMENT 'Plan description',
  `created_at`      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_plan_type` (`plan_type`),
  CONSTRAINT `fk_aiteam_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='AI team assessment answers and matched plan';

-- ============================================================
-- 8. User Reviews Table - Periodic review records
-- ============================================================
CREATE TABLE IF NOT EXISTS `user_reviews` (
  `id`              BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`         BIGINT UNSIGNED   NOT NULL,
  `cycle`           VARCHAR(20)       NOT NULL COMMENT 'Review cycle: weekly/monthly/quarterly',
  `period_label`    VARCHAR(50)       NOT NULL COMMENT 'Period label e.g. 2026年4月第3周',
  `revenue`         VARCHAR(50)       DEFAULT NULL COMMENT 'Period revenue',
  `traffic`         VARCHAR(50)       DEFAULT NULL COMMENT 'Period traffic/visitors',
  `customers`       VARCHAR(50)       DEFAULT NULL COMMENT 'Period customer count',
  `efficiency`      TEXT              DEFAULT NULL COMMENT 'Efficiency improvement notes',
  `next_goal`       TEXT              DEFAULT NULL COMMENT 'Next period goals',
  `notes`           VARCHAR(1000)     DEFAULT NULL COMMENT 'Additional notes',
  `created_at`      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_cycle` (`cycle`),
  KEY `idx_user_cycle` (`user_id`, `cycle`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User periodic review records (weekly/monthly/quarterly)';

-- ============================================================
-- 9. System Config Table - System configuration items
-- ============================================================
CREATE TABLE IF NOT EXISTS `sys_config` (
  `id`            BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `config_key`    VARCHAR(100)      NOT NULL,
  `config_value`  TEXT              NOT NULL,
  `category`      VARCHAR(50)       NOT NULL,
  `description`   VARCHAR(255)      DEFAULT NULL,
  `is_public`     TINYINT(1)        NOT NULL DEFAULT 0 COMMENT '1=public (no auth needed), 0=private',
  `updated_by`    BIGINT UNSIGNED   DEFAULT NULL COMMENT 'Last updated by user ID',
  `created_at`    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`),
  KEY `idx_category` (`category`),
  KEY `idx_is_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='System configuration items with caching support';

-- ============================================================
-- 10. AI Chat Records Table - User-AI conversation history
-- ============================================================
CREATE TABLE IF NOT EXISTS `ai_chat_records` (
  `id`            BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED   NOT NULL,
  `session_id`    VARCHAR(50)       NOT NULL COMMENT 'Conversation session identifier',
  `role`          TINYINT           NOT NULL COMMENT '1=user, 2=assistant, 3=system',
  `content`       TEXT              NOT NULL,
  `model_name`    VARCHAR(50)       DEFAULT NULL COMMENT 'AI model name',
  `token_input`   INT               DEFAULT 0,
  `token_output`  INT               DEFAULT 0,
  `response_ms`   INT               DEFAULT NULL COMMENT 'Response time in milliseconds',
  `is_encrypted`  TINYINT(1)        NOT NULL DEFAULT 0 COMMENT '1=content encrypted, 0=plain',
  `created_at`    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_user_session` (`user_id`, `session_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_chat_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='AI chat conversation records with session support';

-- ============================================================
-- 11. AI Logs Table - LLM API call logs and errors
-- ============================================================
CREATE TABLE IF NOT EXISTS `ai_logs` (
  `id`            BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED   DEFAULT NULL COMMENT 'Nullable for system-level calls',
  `log_type`      TINYINT           NOT NULL COMMENT '1=normal, 2=error, 3=rate_limited, 4=timeout',
  `model_name`    VARCHAR(50)       DEFAULT NULL,
  `api_endpoint`  VARCHAR(255)      DEFAULT NULL,
  `request_body`  JSON              DEFAULT NULL,
  `response_code` INT               DEFAULT NULL,
  `error_message` TEXT              DEFAULT NULL,
  `token_used`    INT               DEFAULT 0,
  `duration_ms`   INT               DEFAULT NULL,
  `ip_address`    VARCHAR(45)       DEFAULT NULL COMMENT 'IPv4 or IPv6 address',
  `created_at`    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_log_type` (`log_type`),
  KEY `idx_model_name` (`model_name`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='LLM API call logs for monitoring and debugging';

-- ============================================================
-- Insert default system configurations
-- ============================================================
INSERT INTO `sys_config` (`config_key`, `config_value`, `category`, `description`, `is_public`) VALUES
  ('review_enabled', 'true', 'feature', 'Whether review feature is enabled', 1),
  ('city_policy_enabled', 'false', 'feature', 'Whether city policy feature is enabled', 1),
  ('mbti_fast_mode_available', 'true', 'feature', 'Whether MBTI fast mode is available', 1),
  ('mbti_total_questions', '93', 'mbti', 'Total number of MBTI questions', 1),
  ('mbti_fast_mode_questions', '30', 'mbti', 'Number of MBTI fast mode questions', 1),
  ('info_collect_steps', '7', 'info_collect', 'Number of info collection steps', 1),
  ('ai_team_questions', '10', 'ai_team', 'Number of AI team assessment questions', 1),
  ('app_version', '"1.0.0"', 'system', 'Application version', 1),
  ('maintenance_mode', 'false', 'system', 'Whether system is in maintenance mode', 1);
