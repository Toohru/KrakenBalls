import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Exercise extends Model {
    static table = 'exercises';

    @field('name') name;
    @field('is_hold') isHold;
    @field('reps_or_seconds') repsOrSeconds;
    @field('sets') sets;
}