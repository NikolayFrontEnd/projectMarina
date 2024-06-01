
import Header from "./header";
import "./Subject.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink,useParams} from "react-router-dom";
const Sub = () =>{

const [userRole, setUserRole] = useState(''); 
useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:2222/user', { headers: { Authorization: `Bearer ${token}` } });
          setUserRole(response.data.role); // Установка роли пользователя
        } catch (error) {
          console.error('Ошибка при получении данных пользователя', error);
        }
      }
    };
    fetchUserData();
 
  }, []);



  const {semesterId,subjectId } = useParams();
  const [subject, setSubject] = useState("");


  
  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:2222/oneSubject/${subjectId}`);
        setSubject(response.data.name); // Здесь вы можете обработать полученные данные предмета
      } catch (err) {
        console.log("Не удалось получить информацию о предмете", err);
      }
    };



    fetchSubjectData();
  }, [subjectId]);

  const [events, setEvents] = useState([]); // Состояние для хранения событий

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Предполагаем, что сервер доступен по этому адресу
        const response = await axios.get(`http://localhost:2222/queues/subject/${subjectId}`);
        setEvents(response.data); // Сохранение событий в состояние
        
      } catch (err) {
        console.log("Не удалось получить информацию о событиях!", err);
      }
    };

    fetchEventData();
  }, [subjectId]);

  const DeleteQueue = async (eventId) => { // Принимаем eventId как параметр
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:2222/deleteQueue/${eventId}`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Событие успешно удалено!');
      // Обновление списка событий после удаления
      setEvents(currentEvents => currentEvents.filter(event => event._id !== eventId));
    } catch (error) {
      console.error("Ошибка при удалении!!!", error);
    }
  };
  

  return (
    <>
      <Header />
      <div className="SubjectContainer">
        <div className="SubjectBlock">
          <div className="NameSubject">{subject}</div>
          <div className="btnCreate">
          { userRole === 'vip' &&         <NavLink to = {`/doQueue/${semesterId}/${subjectId}`} className="button primary">Создать очередь</NavLink>}
          </div>
          {events.map((event) => {
  const start = new Date(`01/01/1970 ${event.startTime}`);
  const end = new Date(`01/01/1970 ${event.endTime}`);
  const duration = (end - start) / 60000; // Разница в минутах
  return (
    <div className="queue" key={event._id}>
      <div className="NameSubject2">{event.name}</div>
      <div className="timeDuration">Длительность: {duration} минут</div>
      <div className="countPlaces">Количество слотов: {event.slots.length}</div>
      <NavLink to={`/deleteQueue/${semesterId}/${event._id}`} className="button primary">Записаться на сдачу</NavLink>
      {userRole === 'vip' && <button onClick={() => DeleteQueue(event._id)} className="button primary5">Удалить очередь</button>}
      <div className="timeDuration2">Дата создания: {new Date(event.createdAt).toLocaleDateString()}</div>
    </div>
  );
})}

<NavLink style = {{marginTop: "40px"}} to="/main" className="button primary">Вернуться на главную</NavLink>
        </div>
        
      </div>
    </>
  );
};

export default Sub;