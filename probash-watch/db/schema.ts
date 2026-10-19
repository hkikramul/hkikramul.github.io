import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const reports=sqliteTable('reports',{id:text('id').primaryKey(),owner:text('owner').notNull(),payload:text('payload').notNull(),status:text('status').notNull().default('pending'),created:text('created').notNull()});
export const audit=sqliteTable('audit',{id:text('id').primaryKey(),actor:text('actor').notNull(),action:text('action').notNull(),target:text('target').notNull(),created:text('created').notNull()});
export const candidates=sqliteTable('candidates',{id:text('id').primaryKey(),payload:text('payload').notNull(),created:text('created').notNull()});
