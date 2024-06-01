import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate
/* const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isVip: false, // Добавляем переменную для отслеживания статуса VIP
  });

  const navigate = useNavigate(); // Использование хука для навигации

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Деструктуризируем formData, чтобы передать все данные формы, включая статус VIP
      const response = await axios.post('http://localhost:2222/register', formData);
      console.log('Registration successful', response.data);
      localStorage.setItem('token', response.data.token);
      navigate("/main"); // Переход на главную страницу
    } catch (error) {
      console.error('Registration failed', error.response.data);
    }
  };
const [vvod,setVvod] = useState({
  email: '',
  password: '',
});
const handleChange2 = (e) => {
  setVvod({ ...vvod, [e.target.name]: e.target.value });
};
const handleSubmit2 = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:2222/login', vvod);
    console.log('Registration successful', response.data);
    localStorage.setItem('token', response.data.token);
    navigate("/main"); // Переход на главную страницу
  } catch (error) {
    console.error('Login failed', error.response.data);
  }
};
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="checkbox"
          name="isVip" // Устанавливаем имя для чекбокса
          checked={formData.isVip} // Связываем значение чекбокса со стейтом
          onChange={handleChange} // Используем тот же обработчик изменений
        />
        <label>Я VIP пользователь</label>
        <button type="submit">Регистрация</button>
      </form>

<form  onSubmit={handleSubmit2}>
<input           type="password"
          placeholder="Password"
          name="password"
          value={vvod.password}
          onChange={handleChange2}
        />
<input  
      type="email"
      placeholder="Email"
      name="email"
      value={vvod.email}
      onChange={handleChange2}
      />
<button  type="submit"> вход  </button>
</form>

    </>
  );
};

export default SignUpForm; */ 

/* 
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate
const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Использование хука для навигации
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:2222/register', formData);
      console.log('Registration successful', response.data);
      localStorage.setItem('token', response.data.token);
      navigate("/main"); // Переход на главную страницу
    } catch (error) {
      console.error('Registration failed', error.response.data);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full name" name="name" value={formData.name} onChange={handleChange} required />
        <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
        <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
        <input type="checkbox"  />
        <label >Я VIP пользователь</label>
      <button type="submit">Регистрация</button>
      </form>
    </>
  );
};
export default SignUpForm;
*/
import styles from './a.module.css';
const SignUpForm = () => {

  const [isLoginActive, setIsLoginActive] = useState(false);
    const toggleForm = () => {
      setIsLoginActive(!isLoginActive);
  };
  const [formData, setFormData] = useState({
    FirstNAme: '',
    email: '',
    password: '',
    groupName: '',
    FirstNAme:'',
    Familia: '',
    LastName: '',
    NumberGroup: '',
    isVip: false, 
  });


// ТУТ будет проверка на название группы
const [proverkaGroup, setProverkaGroup ] = useState(false);
const Proverka = (str) =>{
const word = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
for(let i = 0; i<str.length;i++){
  if(!word.includes(str[i])){
    return false
  }
 
}
return true

}







  const navigate = useNavigate(); 



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    console.log(`Изменено значение поля ${name}: ${value}`);
    if (Proverka(formData.groupName)) {
      console.log("all okay with nameGroup");
      setProverkaGroup(false); // Устанавливаем proverkaGroup в true, если проверка прошла успешно
    } else {
      console.log("all bad with nameGroup");
      setProverkaGroup(true); // Устанавливаем proverkaGroup в false, если проверка не прошла
      setTimeout(()=>{
        setProverkaGroup(false);
      },8000)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(Proverka(formData.groupName)) {
    try {
  
      const response = await axios.post('http://localhost:2222/register', formData);
      console.log('Registration successful', response.data);
      localStorage.setItem('token', response.data.token);
localStorage.setItem('userID', response.data._id);
      navigate("/main"); 
      console.log('Отправлены данные:', formData);
    } catch (error) {
      
      if (error.response && error.response.data.message === "В этой группе уже два старосты") {
        alert('Не может быть больше двух старост в группе!');
      }
      
      console.error('Registration failed', error.response.data);
      console.log('Отправлены данные:', formData);
      if (error.response.data.message === "Пользователь с таким email уже существует") {
        setisTrueEmail(true);
        setTimeout(()=>{
          setisTrueEmail(false);
        }, 8000);

      }
      if (formData.FirstNAme.length < 5) {
        setIsTrueN(true);
        setTimeout(() => {
          setIsTrueN(false);
        }, 8000);
      }

      if (formData.password.length < 5) {
        setIsTrueP(true);
        setTimeout(() => {
          setIsTrueP(false);
        }, 8000);
      }

    }
  }
  };

const [vvod,setVvod] = useState({
  email: '',
  password: '',
});
const handleChange2 = (e) => {
  setVvod({ ...vvod, [e.target.name]: e.target.value });
};
const handleSubmit2 = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:2222/login', vvod);
    console.log('Registration successful', response.data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userID', response.data._id);
    navigate("/main"); 
  } catch (error) {
    console.error('Login failed', error.response.data);
    setisLogin(true);
    setTimeout(()=>{
      setisLogin(false)
    }, 5000)
  }
};
const [isTrueN, setIsTrueN] = useState(false);
const [isTrueP, setIsTrueP] = useState(false);
const [isTrueEmail, setisTrueEmail] = useState(false);
const [isLogin, setisLogin] = useState(false);




    return (
      <>    
  <div className = {styles.c}>   
<section className={`${styles.wrapper} ${isLoginActive ? styles.active : ''}`}>
      <div className={`${styles.form} ${styles.signup}`}>
        <header onClick={toggleForm}>Регистрация</header>
        <form action="#" onSubmit={handleSubmit}>

        <input className = {isTrueN ? styles.in : ""}
          type="text"
          placeholder="Имя "
          name="FirstNAme"
          value={formData.FirstNAme}
          onChange={handleChange}
          required
        />
       <div className = {styles.ErrorChacked}  style={{display: isTrueN ? 'block' : 'none'}}>Слишком маленькое имя!</div> 
      <input className = {isTrueN? styles.in : ""}
          type="text"
          placeholder="Фамилия "
          name="Familia"
          value={formData.Familia}
          onChange={handleChange}
          required
        />
      
      <input className = {isTrueN? styles.in : ""}
          type="text"
          placeholder=" Отчество"
          name="LastName"
          value={formData.LastName}
          onChange={handleChange}
          required
        />
            <input className = {isTrueN? styles.in : ""}
          type="text"
          placeholder=" Название Группы"
          name="groupName"
          value={formData.groupName}
          onChange={handleChange}
          required
        />  
        <div style = {{display: proverkaGroup ? 'block' : 'none', color:'red'}}>Название группы должно быть написано русскими буквами большим!</div>
      <input className = {isTrueN? styles.in : ""}
          type="number"
          placeholder=" Номер Группы"
          name="NumberGroup"
          value={formData.NumberGroup}
          onChange={handleChange}
          required
        />  



        <input className = {isTrueEmail ? styles.in : ""}
          type="email"
          placeholder="Почта"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

 <div style = {{color:"red", display: isTrueEmail ? "block" : "none"}}>Пользователь с таким логином уже существует!</div> 

        <input className = {isTrueP ? styles.in: ""}
          type="password"
          placeholder="Пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

 <div style = {{color:"red", display:isTrueP?"block":"none"}}>Слишком маленький пароль!</div> 

          <div className={styles.checkbox}>
          <input
          type="checkbox"
          name="isVip" 
          checked={formData.isVip} 
          onChange={handleChange} 
        />
            <label>Я являюсь старостой группы</label>

          </div>
  <button className={styles.btn1} type="submit">Регистрация</button> 


        </form>
      </div>


      <div className={`${styles.form} ${styles.login}`}>
        <header onClick={toggleForm}>Вход</header>
        <form action="#" onSubmit={handleSubmit2}>
        <input           type="password"  
          placeholder="Пароль"
          name="password"
          value={vvod.password}
          onChange={handleChange2}
        />
<input  
      type="email"
      placeholder="Почта"
      name="email"
      value={vvod.email}
      onChange={handleChange2}
      />

<div style = {{color:"red", display: isLogin ? "block" : "none"}}>Неправильный логин или пароль!</div>

          <button className={styles.btn2} type="submit">Вход</button>
        </form>
      </div>
    </section>
  
    </div>
    <div className = {styles.quest}> По всем вопросом писать на почту: StudentLight@gmail.com </div>
    </>
    );
};
export default SignUpForm; 

/*   const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
      //isLeader: false,
  });
  const [error, setError] = useState(''); */

   /* const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
          ...formData,
        //  [name]: type === 'checkbox' ? checked : value,
      });

      console.log(`${name}: ${value}`);

  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('/register', {
              name: formData.fullName,
              email: formData.email,
              password: formData.password,
          });

          console.log(response.data);
          // Можно сохранить токен в localStorage или обработать данные пользователя
          // window.localStorage.setItem('token', response.data.token);
      } catch (err) {
        setError(err.response && err.response.data ? err.response.data.message : 'Ошибка при регистрации');
        console.error(err.response ? err.response.data : err);
      }
  }; */

  //console.log(name,password,email);