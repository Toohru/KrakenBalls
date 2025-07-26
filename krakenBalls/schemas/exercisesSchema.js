import { tableSchema } from '@nozbe/watermelondb';

export const exerciseSchema = tableSchema({
    name: 'exercises',
    columns: [
        { name: 'name', type: 'string' },
        { name: 'is_hold', type: 'boolean' },
        { name: 'reps_or_seconds', type: 'number' },
        { name: 'sets', type: 'number' },
    ],
});