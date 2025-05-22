import { Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, TextField, Button, Typography, Box } from '@mui/material'
import { login } from '../../redux/modules/user'
import Loading from '../../components/layout/loading/Loading'
import '../../App.scss'
import { useAppDispatch } from '../../hooks'

function Authorization() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Простая валидация
    if (!username || !password) {
      setError('Заполните все поля');
      return;
    }

    try {
      dispatch(login(username, password))
      navigate('/profile')
    } catch (err) {
      setError('Неверный email или пароль');
      console.error('Ошибка авторизации:', err);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
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
            Вход в аккаунт
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
            Войти
          </Button>

          <Typography align="center">
            Нет аккаунта?{' '}
            <Button 
              onClick={() => navigate('/registration')} 
              color="primary"
            >
              Зарегистрироваться
            </Button>
          </Typography>
        </Stack>
      </Box>
    </Suspense>
  );
}

export default Authorization;