import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from 'scenes/HomePage';
import LoginPage from 'scenes/LoginPage';
import ProfilePage from 'scenes/ProfilePage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';

function App() {
  const mode = useSelector((state) => state.mode); // mode is a string that can be 'light' or 'dark'
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); // themeSettings(mode) is a function that returns a theme object
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/profile/:userId" element={isAuth ? <profilePage /> : <Navigate to="/" /> } />
        </Routes>  
        </ThemeProvider>
      </BrowserRouter>
    </div>

  );
}

export default App;
