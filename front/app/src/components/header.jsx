import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './main.module.css'
const Header = () => {
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [group, setGroup] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await axios.get('http://localhost:2222/user', { headers: { Authorization: `Bearer ${token}` } });
            setUserName(response.data.name); // Установка имени пользователя
            setUserRole(response.data.role);
            setGroup(response.data.group)
          } catch (error) {
            console.error('Ошибка при получении данных пользователя', error);
          }
        }
      };
      fetchUserData();
    }, []);
    const navigTomainPage = () =>{
      navigate('/main')
    }
    const handleLogout = () => {
      localStorage.removeItem('token'); 
      navigate('/'); 
  };



    return (
      <>
  
        <div>
            <div className={style.header}>
            <button onClick={navigTomainPage} className="button primary">ВЕРНУТЬСЯ НА ГЛАВНУЮ</button>
            <div>
                    <div  className={style.name}>{userName}</div>

                    <div className={style.position}>{userRole === 'vip' ? '  староста группы ' : 'обычный студент '} {group}</div>
                </div>
              
                <button onClick={handleLogout} className={style.btn3}>ВЫЙТИ ИЗ АККАУНТА</button>
             
            </div>
        </div>

      </>
    )
  }

  export default Header;