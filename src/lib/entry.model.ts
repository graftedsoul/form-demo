import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  correct_answers: { type: String, required: true },
  time: { type: Number, required: true },
  score: { type: Number, required: true },
});

const Entry = mongoose.models.Entry || mongoose.model('Entry', entrySchema);

export default Entry;
