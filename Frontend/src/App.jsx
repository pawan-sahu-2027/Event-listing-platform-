import react from 'react';
import {RouterProvider, createBrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import GeneralInfo from './components/GeneralInfo';
import Footer from './components/Footer';
import OtpInput from './pages/auth/otpInput';
// import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './components/Profile'; 
import AddEvent from './pages/admin/AddEvent';
import DashboardLayout from "./pages/admin/DashboardLayout";
import PaymentSuccess from './pages/admin/PaymentSuccess';
import SingleEvent from './components/SingleEvent';
import DeleteEvents from './pages/admin/DeleteEvent';
import EventsPage from './components/EventsPage';
import ChatBot from "./components/boat/ChatBot";
// import PaymentPage from './pages/admin/PaymentPage';
const router  = createBrowserRouter([
  {
    path : '/' ,
    element :<> <Navbar />
                {/* <Layout/> */}
                <EventsPage/>
              <GeneralInfo />
              <Footer />
               <ChatBot />
              </>  

  },{
    path:"/payment-success",
    element:<PaymentSuccess/>
},
  {
    path:"/signup",
    element:<Signup/>
  },{
    path:"/otp-verification", 
    element:<OtpInput/>
  },{
     path:"/login",
     element:<Login/>
  },{
    path:"/profile",
    element:<Profile/>
  },{
    path:"/single-event/:id",
    element:<SingleEvent/>
  },{
    path: "/admin",
    element: <DashboardLayout />,   // ✅ correct
    children: [
      {
        path: "add-event",          // ❗ remove "/"
        element: <AddEvent />,
      },{
        path: "delete-event",          // ❗ remove "/"
        element: <DeleteEvents />,
      }
    ],
  },
]);
   
function App() {
  return (
    
    <RouterProvider router={router} />
  );
}

export default App;