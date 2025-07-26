import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { exerciseSchema } from '../schemas/exercisesSchema';
import Exercise from '../models/exerciseModel';

const adapter = new SQLiteAdapter({
    schema: {
        version: 1,
        tables: [exerciseSchema],
    },
});

const database = new Database({
    adapter,
    modelClasses: [Exercise],
    actionsEnabled: true,
});

export default database;