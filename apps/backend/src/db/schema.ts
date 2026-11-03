import { pgTable, uuid, varchar, integer, timestamp, text, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const monitors = pgTable('monitors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  url: text('url').notNull(),
  interval: integer('interval').default(60).notNull(),
  timeout: integer('timeout').default(5000).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  isPublic: boolean('is_public').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const monitorLogs = pgTable('monitor_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  monitorId: uuid('monitor_id').references(() => monitors.id, { onDelete: 'cascade' }).notNull(),
  statusCode: integer('status_code'),
  responseTime: integer('response_time'),
  isUp: boolean('is_up').notNull(),
  errorMessage: text('error_message'),
  checkedAt: timestamp('checked_at').defaultNow().notNull(),
});
