import { useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './header'; // Ensure correct import path
import { NavLink} from "react-router-dom";
const CreateSubject = () => {
    const [name, setName] = useState('');
    const { semesterId } = useParams(); // Assuming semesterId is passed via URL
    const navigate = useNavigate();  // To navigate back after submission
    const handleSubmit = async (e) => {
        e.preventDefault();  // Это предотвращает автоматическую отправку формы
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Токен не найден, авторизация необходима');
            return;
        }
        try {
            const response = await axios.post('http://localhost:2222/subjects', {
                name,
                semestr: semesterId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'  // Это должно быть частью headers
                }
            });

            console.log(response.data);  // Логирование ответа от сервера
            alert('Предмет успешно добавлен');
            navigate("/main");
        } catch (error) {
            console.error('Ошибка при добавлении предмета', error);
            alert('Не удалось добавить предмет');
        }
    };

    console.log({ name,semestr: semesterId });
    return (
        <>
  <Header/>
    <div className="form-container">
        <h3 className="form-title">Создание предмета</h3>
        <form onSubmit={handleSubmit}>
            <div className="input-container">
                <label htmlFor="subjectName">Название предмета:</label>
                <input
                    id="subjectName"
                    type="text"
                    placeholder="Введите название предмета"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <button className="submit-button" type="submit">Добавить предмет</button>  
        </form>
    </div>
    <NavLink to="/main" className="button primary2">Вернуться на главную</NavLink>
        </>
    );
};
export default CreateSubject;
