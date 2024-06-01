import { NavLink, useNavigate} from "react-router-dom";
import Header from './header';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import style from './main.module.css'
const Semestr = () =>{
    const [userRole, setUserRole] = useState(''); // Добавляем состояние для хранения роли пользователя
    const [semesters, setSemesters] = useState([]);
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
      fetchSemesters();
    }, []);
  


    const fetchSemesters = async () => {
      try {
          const response = await axios.get('http://localhost:2222/getAllSemestrs');
          setSemesters(response.data); 
      } catch (error) {
          console.error('Ошибка при получении семестров', error);
      }
  };

    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            await axios.delete('http://localhost:2222/deleteUser', { headers: { Authorization: `Bearer ${token}` } });
            localStorage.removeItem('token');
            navigate('/');
        } catch (err) {
            console.error("Failed to delete account", err);
        }
      }
  return  <div>
  <Header />
  {userRole === 'vip' && <NavLink className = {style.link} to="/createSemestr"><button className={style.btn2}>ДОБАВИТЬ СЕМЕСТР</button></NavLink>}
  <div className={style.cardGrid}>
  {semesters.map((semester, index) => (
    <div className={`${style.card} ${style.transition}`} key={index}>
      <h2 className={`${style.transition}`}>Семестр № {semester.name} ({semester.year})</h2>
      <p>Просмотри учебные предметы данного семестра!</p>
      <div className={`${style.ctaContainer} ${style.transition}`}>
        <NavLink to={`/subjects/${semester._id}`} className={style.cta}>Просмотр предметов</NavLink>
      </div>
      <div className={`${style.cardCircle} ${style.transition}`}></div>
    </div> 
  ))}
</div>

<div className={style.bt}>      
<button  onClick={handleDeleteAccount} className={style.btn3}>удалить аккаунт</button>
</div>
<div className = 'quest'> 
   

По всем вопросом писать на почту: StudentLight@gmail.com  


 </div>

    </div>
  }
export default Semestr;


/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Header from './Header'; // Assuming 'Header' is correctly imported

const Semestr = () => {
  const [semestrs, setSemestrs] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:2222/user', { headers: { Authorization: `Bearer ${token}` } });
          setUserRole(response.data.role);
        } catch (error) {
          console.error('Ошибка при получении данных пользователя', error);
        }
      }
    };
    fetchUserData();
    fetchSemestrs();
  }, []);

  const fetchSemestrs = async () => {
    try {
      const response = await axios.get('http://localhost:2222/getAllSemestrs');
      setSemestrs(response.data);
    } catch (error) {
      console.error('Ошибка при получении семестров', error);
    }
  };

  return (
    <div>
      <Header />
      {userRole === 'vip' && <NavLink to="/createSemestr"><button>Создать семестр для VIP пользователей</button></NavLink>}
      <div>Название семестра</div>
      {semestrs.map((semestr) => (
        <div key={semestr._id}>{semestr.name}</div>
      ))}
      <NavLink to="/subjects"><button>Все предметы</button></NavLink>
    </div>
  );
};

export default Semestr;
 */