import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <BottomNavBar />
    </>
  );
}