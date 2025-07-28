// src/modules/UserModule/Model.js
import mongoose from 'mongoose'
import { getNextSequence } from '../../helpers/SequenceHelper.js'

const userSchema = new mongoose.Schema({
  idIncremental: {
    type: Number,
    unique: true,
    index: true
  },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['administrador', 'cocinero']
  }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.idIncremental = await getNextSequence('userid')
  }
  next()
})

const User = mongoose.model("User", userSchema)
export default User