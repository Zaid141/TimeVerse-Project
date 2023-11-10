// 1st draft of schemas for TimeVerse app

// Import Mongoose for schema creation
import mongoose from 'mongoose';

const { Schema, model } = mongoose;
mongoose
    .connect(process.env.DSN, {
    })
    .then(() => console.log('MongoDB database Connected'))
    .catch((err) => console.log(err))

// Content schema
const contentSchema = new Schema({
  message: String, // Text message associated with the time capsule
});

// Time Capsule schema
const timeCapsuleSchema = new Schema({
  recipient: { 
    type: String, 
    required: true 
  }, // Recipient email or ID, can be modified to reference User model
  deliveryDate: { 
    type: Date, 
    required: true 
  }, // Date when the time capsule will be delivered
  isPublic: { 
    type: Boolean, 
    default: false 
  }, // Indicates if the time capsule is public or private
  contents: contentSchema // Embed content schema within time capsule
});

// User schema
const userSchema = new Schema({
  username: String,
  password: String,
  capsules: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'TimeCapsule' 
  }] // References to time capsules associated with the user
});




// Create models from the schemas
model('Content', contentSchema);
model('TimeCapsule', timeCapsuleSchema);
model('User', userSchema);