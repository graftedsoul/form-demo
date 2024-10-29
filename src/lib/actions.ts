'use server';

import { connectToDB } from './mongoose';
import Entry from './entry.model';

export async function createEntry(
  first_name: string,
  last_name: string,
  correct_answers: string,
  time: number,
  score: number
) {
  try {
    connectToDB();

    const new_entry = await Entry.create({
      first_name: first_name,
      last_name: last_name,
      correct_answers: correct_answers,
      time: time,
      score: score,
    });

    return new_entry !== null;
  } catch (error) {
    console.error('Create entry unsuccessful');
  }
}
