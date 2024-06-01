import axios from 'axios';
import { useState } from 'react';
import Header from './header'; // Ensure correct import path
import { NavLink, useNavigate} from "react-router-dom";
import styles from './sem.module.css'
const CreateSemestr = () => {
    const navigate = useNavigate();
    const [name, setName] = useState(''); 
    const [year, setyear] = useState('');
    const [Year, setYear] = useState(new Date().getFullYear());
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.post('http://localhost:2222/semestr', { name, year }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Семестр успешно добавлен');
                setName(''); 
                setyear('');
                navigate("/main");
            } catch (error) {
                console.error('Ошибка при добавлении семестра', error);
            }
        }
    };

    return (
        <>
            <Header />
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Номер семестра"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.input}
                />
                       <input
                           min="2024"
                           max="2034"
                           step="1"
                    type="number"
                    placeholder="Год семестра"
                    name="year"
                    required
                    onChange = {(e)=>setyear(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" className={styles.submitButton}>Добавить семестр</button>
               
            </form>

            <NavLink to="/main" className={styles.navLink}>
                    <button className={styles.returnButton}>Вернуться на главную</button>
                </NavLink>
  
        </>
    );
};

export default CreateSemestr;