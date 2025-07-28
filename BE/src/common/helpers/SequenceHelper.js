// src/helpers/sequenceHelper.js
import Sequence from './SequenceModel.js'

export async function getNextSequence(name) {
  const counter = await Sequence.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  return counter.seq
}
