import mongoose from 'mongoose';
// Схема для каждого слота в событии
const SlotSchema = new mongoose.Schema({
  startTime: {
    type: String, // Время начала (например, '14:00')
    required: true
  },
  durationMinutes: {
    type: Number, // Длительность в минутах (например, 10 минут)
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Идентификатор пользователя, который записан на этот слот
    ref: 'user',
    default: null // Изначально пустой, поскольку слот может быть не занят
  },
});

// Основная схема события
const EventSchema = new mongoose.Schema({
  name: {
    type: String, // Название события
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId, // Ссылка на предмет
    ref: 'subject',
    required: true
  },
  semestr: {
    type: mongoose.Schema.Types.ObjectId, // Ссылка на семестр
    ref: 'semestr',
    required: true
  },
  startTime: {
    type: String, // Начальное время события (например, '14:00')
    required: true
  },
  endTime: {
    type: String, // Конечное время события (например, '16:00')
    required: true
  },
  slots: [SlotSchema], // Список слотов с их временем
  countSlots: {
    type: Number, // Общее количество слотов
    required: true
  }
}, {
  timestamps: true // Добавляет `createdAt` и `updatedAt` поля
});

export default mongoose.model('event', EventSchema);
