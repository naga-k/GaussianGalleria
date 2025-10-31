//src/app/db/schema.ts
import {pgTable, serial, text, timestamp, integer} from 'drizzle-orm/pg-core';

export const splats = pgTable('splats', {
    id: serial('id').primaryKey(),
    name: text('name'),
    splatKey: text('splat_key'),
    videoKey: text('video_key'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt'),
    description: text('description')
});

export const galleries = pgTable('galleries', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    thumbnailKey: text('thumbnail_key'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
});

export const splatsToGalleries = pgTable('splats_to_galleries', {
    id: serial('id').primaryKey(),
    splatId: integer('splat_id').references(() => splats.id),
    galleryId: integer('gallery_id').references(() => galleries.id),
    createdAt: timestamp('createdAt').defaultNow()
});