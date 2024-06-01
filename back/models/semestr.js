import mongoose from 'mongoose';
const SemestrSchema = new mongoose.Schema({
    name: {
        type: Number,
        required: true,
        unique: false,
      },
      year: {
        type: Number,
        required: true,
        unique: false,
      },
},
{
    timestamps: true,
}
)
export default mongoose.model('semestr', SemestrSchema );