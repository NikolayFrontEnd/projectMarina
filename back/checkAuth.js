import { body } from 'express-validator';
export const registerValidator = [
body('email', 'неверный формат почты').isEmail(),
body('password', 'пароль должен быть минимум 5 симвоволов').isLength({min:5}),
body('FirstNAme', 'имя должен быть минимум 5 симвоволов').isLength({min:5}),
];

