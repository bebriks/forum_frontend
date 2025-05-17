import { Navigate, Route, Routes } from 'react-router'
import './App.scss'
import Header from './components/layout/header/Header'
import NotFound from './routes/not-found/Not-found'
import { Suspense } from 'react'
import { lazy } from 'react'
import Body from './components/layout/main/Main'
import Loading from './components/layout/loading/Loading'
import { useSelector } from 'react-redux'
import { RootState } from './redux'

const Main = lazy(() => import('./routes/main/Main'))
const Profile = lazy(() => import('./routes/profile/Profile'))
const Registration = lazy(() => import('./routes/registration/Registration'))
const Authorization = lazy(() => import('./routes/authorization/Authorization'))

function App() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <>
      <Header />
      <Body>
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<Loading />}>
              <Main />
            </Suspense>
          } />
          <Route
            path="/authorization"
            element={
              !user.data ? (
                <Suspense fallback={<Loading />}>
                  <Authorization />
                </Suspense>
              ) : (
                <Navigate to="/profile" replace />
              )
            }
          />

          {/* Защищённый маршрут */}
          <Route
            path="/profile"
            element={
              user.data ? (
                <Suspense fallback={<Loading />}>
                  <Profile />
                </Suspense>
              ) : (
                <Navigate to="/authorization" replace />
              )
            }
          />
          <Route path="/registration" element={<Suspense fallback={<Loading />}><Registration /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Body>
    </>
  )
}

export default App
