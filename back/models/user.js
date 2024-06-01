import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: false,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      passwordHash: {
        type: String,
        required: true,
      },
      role: { 
        type: String,
        required: true,
        default: 'regular', // Значение по умолчанию
      },
      group:{
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  export default mongoose.model('user', UserSchema);