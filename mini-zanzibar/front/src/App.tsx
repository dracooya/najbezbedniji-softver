import './App.css'
import {UserService} from "./services/UserService.ts";
import {Login} from "./components/Login/Login.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {FileService} from "./services/FileService.ts";
import {Main} from "./components/Main/Main.tsx";

function App() {
  const userServiceSingleton = new UserService();
  const fileServiceSingleton = new FileService();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login userService={userServiceSingleton}/>}/>
            <Route path="/main" element={<Main fileService={fileServiceSingleton} userService={userServiceSingleton}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
