import Header from './header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate} from "react-router-dom";
import './createSubjects.css'
const Subjects = () => {
  const navigate = useNavigate();
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



    const { semesterId } = useParams(); // Extract semesterId from URL parameters
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/allSubjects/${semesterId}`); // Adjusted endpoint
                setSubjects(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Ошибка при получении предметов', error);
            }
        };
        fetchSubjects();
    }, [semesterId]); // Re-fetch when semesterId changes

const DeleteSemestr = async() =>{
  try{
    const token = localStorage.getItem('token');
      await axios.delete((`http://localhost:2222/semestr/${semesterId}`), {
          headers: { Authorization: `Bearer ${token}` }
      });
      alert('Семестр успешно удален!');
      navigate("/main");
  

  }catch(error){
    console.error( "Ошибка при удалении!!!", error);
  }
}

const DeleteSubject = async(subjectId) => { // Добавляем параметр subjectId
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:2222/deleteSubject/${subjectId}`, { // Используем subjectId для запроса
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Предмет успешно удален!');
    // Обновление списка предметов после удаления
    setSubjects(subjects.filter(subject => subject._id !== subjectId));
  } catch (error) {
    console.error("Ошибка при удалении!!!", error);
  }
};


    return (
        <>
            <Header />
       
        <div className="subjects-container">
         <h3 className = "Words">Все предметы:</h3> 
            {subjects.map((subject, index) => (
              
                <div className="subject" key={index}> 
                    <span>{subject.name}</span>
                  { userRole === 'vip' && <button onClick={() => DeleteSubject(subject._id)} className="delete-button">удалить...</button>}
                  <NavLink to={`/subject/${semesterId}/${subject._id}`} className="button primary">     Посмотреть        </NavLink>
                </div>
     
            ))}
          { userRole === 'vip' && <NavLink to={`/createSubject/${semesterId}`} className="button primary">Создать предмет</NavLink>}
            <NavLink to="/main" className="button primary">Вернуться на главную</NavLink>
           { userRole === 'vip' && <button onClick = {DeleteSemestr} className="button primary5"> Удалить семестр </button>}
        </div>
        </>
    );
};

export default Subjects;
