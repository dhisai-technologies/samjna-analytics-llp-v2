DO $$ BEGIN
 CREATE TYPE "public"."interview_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."interview_question_type" AS ENUM('TEXT', 'SELECT', 'IMAGE', 'AUDIO', 'VIDEO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."nursing_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."nursing_question_type" AS ENUM('TEXT', 'SELECT', 'IMAGE', 'AUDIO', 'VIDEO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"mimetype" text NOT NULL,
	"size" double precision NOT NULL,
	"readable_by" jsonb,
	"readable_upto" timestamp DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_analytics" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "files_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "models" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"mimetype" text NOT NULL,
	"size" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "models_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"type" varchar(255) DEFAULT 'COMMON' NOT NULL,
	"message" text NOT NULL,
	"link" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otps" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"otp" varchar(6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"retries" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "otps_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"uid" varchar(30) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" text,
	"role" varchar(30) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"module" varchar(30) NOT NULL,
	"max_participants" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_interview_questions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" varchar(255),
	"type" "interview_question_type" DEFAULT 'TEXT' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"record_video" boolean DEFAULT true NOT NULL,
	"time_limit" integer DEFAULT 0 NOT NULL,
	"options" jsonb,
	"file" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interview_participants" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"uid" varchar(255) DEFAULT 'USR-00' NOT NULL,
	"interview_id" varchar(30) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interview_questions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"interview_id" varchar(30) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" varchar(255),
	"type" "interview_question_type" DEFAULT 'TEXT' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"record_video" boolean DEFAULT true NOT NULL,
	"time_limit" integer DEFAULT 0 NOT NULL,
	"options" jsonb,
	"file" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interview_sessions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"uid" varchar(255) NOT NULL,
	"interview_id" varchar(30) NOT NULL,
	"key" varchar(255),
	"name" text NOT NULL,
	"logs" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"individual_analytics" jsonb,
	"combined_analytics" jsonb,
	"files" jsonb,
	"error" jsonb,
	"user_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "interview_sessions_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interviews" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"level" "interview_level" DEFAULT 'BEGINNER' NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core_nursing_questions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" varchar(255),
	"type" "nursing_question_type" DEFAULT 'TEXT' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"record_video" boolean DEFAULT true NOT NULL,
	"time_limit" integer DEFAULT 0 NOT NULL,
	"options" jsonb,
	"file" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nursing_participants" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"uid" varchar(255) DEFAULT 'USR-00' NOT NULL,
	"nursing_test_id" varchar(30) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nursing_questions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"nursing_test_id" varchar(30) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" varchar(255),
	"type" "nursing_question_type" DEFAULT 'TEXT' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"time_limit" integer DEFAULT 0 NOT NULL,
	"record_video" boolean DEFAULT true NOT NULL,
	"options" jsonb,
	"file" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nursing_sessions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"uid" varchar(255) NOT NULL,
	"nursing_test_id" varchar(30) NOT NULL,
	"key" varchar(255),
	"name" text NOT NULL,
	"logs" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"individual_analytics" jsonb,
	"combined_analytics" jsonb,
	"files" jsonb,
	"error" jsonb,
	"user_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "nursing_sessions_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nursing_tests" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"level" "nursing_level" DEFAULT 'BEGINNER' NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stress_sessions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"uid" varchar(255) NOT NULL,
	"key" varchar(255),
	"name" text NOT NULL,
	"logs" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"individual_analytics" jsonb,
	"combined_analytics" jsonb,
	"combined_files" jsonb,
	"error" jsonb,
	"user_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "stress_sessions_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stroop_test_questions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"level" varchar(255) NOT NULL,
	"source" jsonb,
	"destination" jsonb,
	"answer" jsonb,
	"time_limit" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stroop_test_sessions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"uid" varchar(255) NOT NULL,
	"key" varchar(255),
	"name" text NOT NULL,
	"logs" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"individual_analytics" jsonb,
	"combined_analytics" jsonb,
	"files" jsonb,
	"error" jsonb,
	"user_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "stroop_test_sessions_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interview_participants" ADD CONSTRAINT "interview_participants_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nursing_participants" ADD CONSTRAINT "nursing_participants_nursing_test_id_nursing_tests_id_fk" FOREIGN KEY ("nursing_test_id") REFERENCES "public"."nursing_tests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nursing_questions" ADD CONSTRAINT "nursing_questions_nursing_test_id_nursing_tests_id_fk" FOREIGN KEY ("nursing_test_id") REFERENCES "public"."nursing_tests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nursing_sessions" ADD CONSTRAINT "nursing_sessions_nursing_test_id_nursing_tests_id_fk" FOREIGN KEY ("nursing_test_id") REFERENCES "public"."nursing_tests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
