import mongoose from 'mongoose';
const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
      },
    semestr: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'semestr',
        required: true,
        unique: false,
      },
},
{
    timestamps: true,
}
)
export default mongoose.model('subject', SubjectSchema );