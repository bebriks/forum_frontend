import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, TextField, Button, Typography, Box, Alert } from '@mui/material'
import '../../App.scss'
import { register } from '../../redux/modules/user'
import { useAppDispatch } from '../../hooks'

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Заполните все поля');
      return;
    }

    try {
      dispatch(register(username, password) )
      navigate('/profile');
    } catch (err) {
      setError('Неверный email или пароль');
      console.error('Ошибка авторизации:', err);
      <Alert severity="error">
        'Ошибка авторизации:'
      </Alert>
    }
  };

  return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          minWidth: 400,
          margin: '0 auto',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <Stack direction="column" spacing={3}>
          <Typography variant="h5" align="center">
            Регистрация
          </Typography>

          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          <TextField
            label="Login"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Зарегистрироваться
          </Button>

          <Typography align="center">
            Уже есть аккаунт?{' '}
            <Button 
              onClick={() => {
                navigate('/authorization')
            }} 
              color="primary"
            >
              Войти
            </Button>
          </Typography>
        </Stack>
      </Box>
  );
}

export default Registration