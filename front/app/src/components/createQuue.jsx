import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/header'
import { useState } from 'react';
import axios from 'axios';

const CreateQueue = () =>{
const { semesterId, subjectId} = useParams();
const [name,setName] = useState('');
const [time,setTime]=useState('');
const [time2,setTime2]=useState('');
const [duration, setDuration] = useState('');
const navigate = useNavigate();
const handleSubmit = async (e) => {
    e.preventDefault();
    const start = new Date(`01/01/1970 ${time}`);
    const end = new Date(`01/01/1970 ${time2}`);
    const difference = end - start;
    const differenceInMinutes = Math.round(difference / (1000 * 60));

    if (differenceInMinutes < 0) {
      alert("Вы ввели начало позже конца!");
      return;
    }

    const count = Math.floor(differenceInMinutes / duration);

    const slots = Array.from({ length: count }, (_, index) => ({
      startTime: new Date(start.getTime() + duration * index * 60000).toTimeString().substring(0, 5),
      durationMinutes: parseInt(duration),
      user: null  // По умолчанию пользователь не назначен
    }));

    try {
      const token = localStorage.getItem('token');  // Предполагается, что токен сохранен в localStorage
      const response = await axios.post('http://localhost:2222/createqueue', {
        name,
        semestr: semesterId,
        subject: subjectId,
        startTime: time,
        endTime: time2,
        slots,
        countSlots: count
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      alert('Очередь успешно создана!');
      navigate(`/subject/${semesterId}/${subjectId}`);
    } catch (error) {
      console.error("Ошибка при создании очереди:", error);
      alert('Не удалось создать очередь!');
    }
  };
    return(<>
    <Header/>
    <div className="form-container">
        <h3 className="form-title">Создание очереди</h3>
        <form onSubmit={handleSubmit}>
            <div className="input-container">
                <label htmlFor="subjectName">Название очереди:</label>
                <input
                    id="subjectName"
                    type="text"
                    placeholder="Введите название очереди"
                    value = {name}
                    onChange={(e)=> setName(e.target.value)}
                />

<label style={{ marginTop: '30px' }} htmlFor="subjectName">Начало сдачи:</label>
<input
   id="startTime"
    type="time"
    placeholder="Введите время"
    value={time}
    onChange={(e) => setTime(e.target.value)}
/>

<label style={{ marginTop: '30px' }} htmlFor="subjectName">Конец сдачи:</label>
<input
    id="endTime"
    type="time"
    placeholder="Введите время"
    value={time2}
    onChange={(e) => setTime2(e.target.value)}
/>

<label style={{ marginTop: '30px' }} htmlFor="subjectName">Продолжительность сдачи одного слота в минутах:</label>
                <input
                    id="duration"
                    type="number"
                    placeholder="Введите продолжительность слота"
value = {duration}
onChange={(e)=>setDuration(e.target.value)}
                />
            </div>
            <button className="submit-button" type="submit">Добавить очередь</button>  
            
        </form>
    </div>
    <NavLink  to={`/subject/${semesterId}/${subjectId}`} className="button primary2">Вернуться</NavLink>
    </>)
}

export default CreateQueue;