//app/db/schema.ts
import {pgTable, serial, text, timestamp} from  'drizzle-orm/pg-core';

export const splats=pgTable('splats',{
    id: serial('id').primaryKey(),
    name: text('name'),
    splat:text('splat'),
    video:text('video'),
    createdAt:timestamp('createdAt').defaultNow(),
    updatedAt:timestamp('updatedAt')
});