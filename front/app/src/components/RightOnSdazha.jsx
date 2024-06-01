import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import './writetosdacha.css';

const Sdacha = () => {
    const { semesterId, eventId } = useParams(); // Используем eventId, предполагается, что он передается в URL
    const [eventData, setEventData] = useState(null);
console.log(eventId)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/queue/${eventId}`);
                setEventData(response.data);
            } catch (error) {
                console.error("Ошибка при получении данных о событии", error);
            }
        };
        fetchData();
    }, [eventId]);

    const currentUserID = localStorage.getItem('userID');

    //запись на слот
    const handleSignUp = async (slotId) => {
        const userId = localStorage.getItem('userID'); // Убедитесь, что userId корректно сохраняется в localStorage при авторизации
        try {
            const response = await axios.post('http://localhost:2222/addUserToSlot', {
                userId,
                slotId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Убедитесь, что токен доступен
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data.message); // Отобразить сообщение об успешной записи
            // Обновить состояние для отображения изменений
            setEventData(prevState => ({
                ...prevState,
                slots: prevState.slots.map(slot => 
                    slot._id === slotId ? { ...slot, user: { _id: userId, name: "Текущий пользователь" } } : slot
                )
            }));
        } catch (error) {
            console.error("Ошибка при записи на слот", error);
        }
    };

    const handleUnsign = async (slotId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:2222/removeUserFromSlot/${slotId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(response.data.message); // Отобразить сообщение об успешной отписке
            // Обновить состояние для отображения изменений
            setEventData(prevState => ({
                ...prevState,
                slots: prevState.slots.map(slot => 
                    slot._id === slotId ? { ...slot, user: null } : slot
                )
            }));
        } catch (error) {
            console.error("Ошибка при отписке от слота", error);
        }
    };
    
    const isUserSignedUp = eventData && eventData.slots.some(slot => slot.user && slot.user._id === currentUserID);
    return (
        <>
          <Header />
            <div className="blockWithsdacha">
                <div className="blocksdacha">
                    <div className="wordslot">Все слоты:</div>
                    {eventData ? eventData.slots.map((slot, index) => (
                        <div key={slot._id} className="slotBig">
                            <div className="slot">
                                <div className="slotName">Слот {index + 1}</div>
                                <div className="UserName">
                                    {slot.user ? `Записался: ${slot.user.name}` : "Еще никто не записался!"}
                                </div>
                                {!slot.user && !isUserSignedUp && (
                                    <button className="button primary" onClick={() => handleSignUp(slot._id)}>Записаться!</button>
                                )}
                                {slot.user && slot.user._id === currentUserID && (
                                    <button className="button primary" onClick={() => handleUnsign(slot._id)}>Отписаться</button>
                                )}
                            </div>
                            <div className="timeInfo">
                                <div className='dur'>Продолжительность: {slot.durationMinutes} минут</div>
                                <div className='startTime'>Начало в {slot.startTime}</div>
                            </div>
                        </div>
                    )) : <p>Загрузка данных...</p>}
                    <NavLink to={`/subjects/${semesterId}`} className="button primary">Вернуться</NavLink>
                </div>
            </div>
        </>
    );
};

export default Sdacha;