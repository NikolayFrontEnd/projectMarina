import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import cors from 'cors';
import {authMiddleware} from './authmiddlewar.js';
import { validationResult } from 'express-validator';
import {registerValidator} from './checkAuth.js';
import UserModel from './models/user.js';
import SemestrModel from './models/semestr.js';
import SubjectModel from './models/subject.js';
import QueueModel from './models/queque.js'
import checkGroupLeadersLimit from "./Starostamiddleware.js";
const app = express();
app.use(express.json())
app.use(cors());
mongoose.connect('mongodb+srv://nick:donetsk2@cluster0.cjmncrr.mongodb.net/project')
        .then(()=>console.log('we have connect with our data of base'))
        .catch((err)=>console.log('we have error with our connection', err));
        
        app.post('/register', registerValidator, checkGroupLeadersLimit, async(req,res)=>{
            try{
              const errors = validationResult(req);
              if(!errors.isEmpty()){
                return res.status(400).json(errors.array());
              } 
            
              const {FirstNAme, email,password, groupName, Familia, LastName, NumberGroup, isVip, 
               } = req.body;

              const existingUser = await UserModel.findOne({ email });
              if (existingUser) {
                return res.status(400).json({ message: "Пользователь с таким email уже существует" });
              }

                  const salt = await bcrypt.genSalt(10);
                  const hash = await bcrypt.hash(password, salt); 
                  
                  const userRole = isVip ? 'vip' : 'regular';
                  const fullName = `${FirstNAme} ${Familia} ${LastName}`;
                  const group = `${groupName}-${NumberGroup}`;

                  const doc = new UserModel({
                    email,
                    name: fullName,
                    passwordHash: hash,
                    role: userRole,
                    group,
                  });
                const user = await doc.save();
                
                const token = jwt.sign({
                  _id: user._id,
                }, 
                'secret123',
                {
                  expiresIn: '30d',
                },
                
                );
                
                const {passwordHash, ...userData} = user._doc;
            
                res.json({
                  ...userData,
                  token,
                });
            
            }
            catch(err){
              console.log(err);
              res.status(500).json({
            message: "Не удалось зарегистрирвоаться",
              });
            }
            })

            app.post('/login', async (req,res)=>{
                try{
                  const user = await UserModel.findOne({
              email:req.body.email
                  });
              
                  if(!user){
                    return res.status(404).json({
                      message: 'Пользователь не найден',
                    });
                  }
                  const isValidPass=await bcrypt.compare(req.body.password, user._doc.passwordHash);
              if(!isValidPass){
                return res.status(404).json({
                  message: 'Неверный логин или пароль',
                });
              }
              
              const token = jwt.sign({
                _id: user._id,
              }, 
              'secret123',
              {
                expiresIn: '30d',
              },
              
              );
              const {passwordHash, ...userData} = user._doc;
              
              
                  res.json({
                    ...userData,
                    token,
                  });
              
                }catch(err){
                  res.status(500).json({
                    message: "Не удалось авторизоваться",
                       });
                }
              });
              app.get('/user', authMiddleware, async (req, res) => {
                try {
                    const user = await UserModel.findById(req.user._id);
                    if (!user) {
                        return res.status(404).json({ message: 'Пользователь не найден' });
                    }
            
                    const { passwordHash, ...userData } = user._doc;
                    res.json(userData);
                } catch (err) {
                    console.log(err);
                    res.status(500).json({ message: "Не удалось получить данные пользователя" });
                }
            });
            app.post('/semestr', authMiddleware ,async(req,res)=>{
              try{
                const token = req.headers.authorization.split(' ')[1]; 
              
                const semestr = new SemestrModel({
                  name: req.body.name,
                  year: req.body.year,
                })
                const saveSemestr = await semestr.save();
                res.json(saveSemestr);
              }
              catch(err){
                console.log(err);
                    res.status(500).json({ message: "Не удалось добавить семестр!" });
              }
            })
            app.get('/getAllSemestrs', async(req, res) => {
              try {
                const semestrs = await SemestrModel.find({});
                res.json(semestrs);
              } catch (err) {
                console.log(err);
                res.status(500).json({ message: "Не удалось получить все семестры!" });
              }
            });

            app.delete('/semestr/:id', authMiddleware, async (req, res) => {
              try {
                const semestrId = req.params.id; // Получаем ID семестра из параметров запроса
                const deletedSemestr = await SemestrModel.findByIdAndDelete(semestrId); // Удаляем семестр по ID
            
                if (!deletedSemestr) {
                  return res.status(404).json({ message : "Семестр не найден!" });
                }
                res.json({ message: "Семестр успешно удалён!" });
              } catch (err) {
                console.log(err);
                res.status(500).json({ message: "Не удалось удалить семестр!" });
                }
                });


            app.get('/getSemestr', async(req, res) => {
              try {
                const name = req.body.name;
               if (!name) {
                  return res.status(400).json({ message: "Необходимо указать имя семестра!" });
                } 
                const semestr = await SemestrModel.findOne({ name: name });
                  
    

                if (!semestr) {
                  return res.status(404).json({ message: "Семестр не найден!" });
                }
                res.json(semestr);
              } catch (err) {
                console.log(err);
                res.status(500).json({ message: "Не удалось получить семестр!" });
              }
            });

app.post('/subjects', authMiddleware ,async(req,res)=>{
try{
  const token = req.headers.authorization.split(' ')[1]; 
  console.log(req.body);
  const subject = new SubjectModel({
    name: req.body.name,
    semestr: req.body.semestr, 
  });
const saveSubject = await subject.save();
res.json(saveSubject);
}
catch(err){
  console.log(err);
res.status(500).json({ message: "Не удалось добавить предмет!" });
}
})

app.post('/createqueue', authMiddleware, async (req, res) => {
  try {
    const { name, semestr, subject, startTime, endTime, slots, countSlots } = req.body;

    // Создаем новую очередь на основе данных из тела запроса
    const queue = new QueueModel({
      name,
      semestr,
      subject,
      startTime,
      endTime,
      slots,
      countSlots
    });

    // Сохраняем очередь в базу данных
    const savedQueue = await queue.save();
    res.json(savedQueue);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось добавить данные об очереди!" });
  }
});
  
app.get('/queues/subject/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Найти все очереди (события), принадлежащие к конкретному предмету
    const queues = await QueueModel.find({ subject: subjectId }).populate('subject').populate('semestr');

    res.json(queues);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось отправить все очереди!" });
  }
});

app.get('/queue/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    // Находим событие по идентификатору и получаем все связанные данные
    const event = await QueueModel.findById(eventId)
      .populate('subject')
      .populate('semestr')
      .populate({
        path: 'slots',
        populate: { path: 'user' }
      });

    if (!event) {
      return res.status(404).json({ message: "Событие не найдено!" });
    }

    res.json(event);
    console.log(event)
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить информацию о событии!" });
  }
});



// Маршрут для удаления очереди по её идентификатору
app.delete('/deleteQueue/:queueId', authMiddleware, async (req, res) => {
  try {
    // Извлекаем идентификатор очереди из параметров запроса
    const { queueId } = req.params;

    // Проверяем, существует ли очередь с данным идентификатором
    const queue = await QueueModel.findById(queueId);

    if (!queue) {
      return res.status(404).json({ message: "Очередь не найдена!" });
    }

    // Удаляем найденную очередь
    await QueueModel.findByIdAndDelete(queueId);

    res.json({ message: "Очередь успешно удалена!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось удалить очередь!" });
  }
});


app.post('/addUserToSlot', authMiddleware, async (req, res) => {
  try {
    const { slotId, userId } = req.body;
    console.log(req.body.slotId);
    console.log(req.body.userId);

    // Найти событие, содержащее слот с данным идентификатором
    const event = await QueueModel.findOne({ 'slots._id': slotId });
    if (!event) {
      return res.status(404).json({ message: "Слот не найден в событиях!" });
    }

    // Найти слот внутри события по его идентификатору
    const slot = event.slots.id(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Слот не найден!" });
    }

    // Проверить, не занят ли слот уже другим пользователем
    if (slot.user) {
      return res.status(400).json({ message: "Этот слот уже занят другим пользователем!" });
    }

    // Присвоить пользователю слот, корректно преобразовав идентификатор пользователя в ObjectId
    slot.user = new mongoose.Types.ObjectId(userId);

    // Сохранить изменения в документе события
    await event.save();

    res.json({ message: "Пользователь успешно записан на слот!", slot });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось записать пользователя на слот!" });
  }
});

app.delete('/removeUserFromSlot/:slotId', authMiddleware, async (req, res) => {
  try {
    const { slotId } = req.params;

    // Найти событие, содержащее слот с данным идентификатором
    const event = await QueueModel.findOne({ 'slots._id': slotId });
    if (!event) {
      return res.status(404).json({ message: "Слот не найден!" });
    }

    // Найти слот и удалить пользователя
    const slot = event.slots.id(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Слот не найден!" });
    }

    if (!slot.user) {
      return res.status(400).json({ message: "В этом слоте нет пользователя!" });
    }

    // Удалить пользователя из слота
    slot.user = null;

    // Сохранить изменения в документе события
    await event.save();
    res.json({ message: "Пользователь успешно удален из слота!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось удалить пользователя из слота!" });
  }
});


/* app.get('/allSubjects', async(req, res) => {
  try {
    const semestrId = req.body.semestrId;
    if (!semestrId) {
      return res.status(400).json({ message: "Необходимо указать идентификатор семестра!" });
    }
    const subjects = await SubjectModel.find({ semestr: semestrId }).populate('semestr');
    res.json(subjects);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить предметы указанного семестра!" });
  }
}); */

app.get('/allSubjects/:semestrId', async (req, res) => {
  try {
      const semestrId = req.params.semestrId; 
      
      if (!semestrId) {
          return res.status(400).json({ message: "Необходимо указать идентификатор предмета!" });
      }
      const subjects = await SubjectModel.find({ semestr: semestrId }).populate('semestr');
      res.json(subjects);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Не удалось получить предметы указанного семестра!" });
  }

});

app.delete('/deleteSubject/:subjectId', authMiddleware ,async(req,res)=>{
  try{
    const subjectId = req.params.subjectId;
    const deletedSubject = await SubjectModel.findByIdAndDelete(subjectId); 
    if (!deletedSubject) 
    {
      return res.status(404).json({ message : "Предмет не найден!" });
    }
res.json({message:"Предмет удален!"});

  }catch(err){
    console.error(err);
      res.status(500).json({ message: "Не удалось удалить предмет" });
  }
})


app.get('/oneSubject/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Проверяем наличие переданного идентификатора
    if (!subjectId) {
      return res.status(400).json({ message: "Необходимо указать идентификатор предмета!" });
    }

    // Находим предмет по идентификатору
    const subject = await SubjectModel.findById(subjectId).populate('semestr');

    // Проверяем, найден ли предмет
    if (!subject) {
      return res.status(404).json({ message: "Предмет не найден!" });
    }

    res.json(subject);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить информацию о предмете!" });
  }
});

app.delete('/deleteUser', authMiddleware, async (req, res) => {
  try {
      const userId = req.user._id;
      await UserModel.findByIdAndDelete(userId);
      res.json({ message: "User deleted successfully" });
  } catch (err) {
      res.status(500).json({ message: "Failed to delete user" });
  }
});

app.listen(2222, (err)=>{
    if(err){
      return  console.log(err);
    }
console.log("Server is working brilliant now!");
})
