import React, { useEffect, useState } from 'react'
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Home from './pages/Home.js';
import Records from './pages/Records/Records.js';
import Connect from './pages/Connect/Connect.js';
import AddRecord from './pages/Records/AddRecord';

const align_center_style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '50px',
  zIndex: 100,
  border: "15px solid light gray"
}
// App.js is the provider of the context
export const managerContext = React.createContext()

function App() {
  const [db, setDb] = useState([])
  const [isLogin, setIsLogin] = useState(false)

  const LogoutHandler = () => {
    setIsLogin(false)
    fetch('/logout').then(res => res.json()).then(data => {
      if (data['status'] === 'success')
        setDb([])
      else alert("something wrong happend! check the backend server!")
    })
  }

  useEffect(() => {
    fetch('islogin').then(res => res.json()).then(data => {
      console.log(data)
      console.log(isLogin)
      const api_isLogin = data['status'] === 'success'
      if (api_isLogin && !isLogin)
        setIsLogin(true)
      else if (!api_isLogin && isLogin)
        setIsLogin(false)
    })
  }, [])
  return (
    <Router>
      <div class="site-header">
        <nav class="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
          <div class="container">
            <Link class="navbar-brand mr-4" to="/">Password Keeper</Link>
            <div class="collapse navbar-collapse" id="navbarToggle">
              <div class="navbar-nav mr-auto">
                {isLogin &&
                  <><Link class="nav-item nav-link" to="/records">My Records</Link>
                    <Link class="nav-item nav-link" to="/add-record">Add Record</Link></>}
              </div>
              <div class="navbar-nav">
                {isLogin ?
                  <Link class="nav-item nav-link" onClick={LogoutHandler} to="/">Logout</Link>
                  :
                  <Link class="nav-item nav-link" to="/connect">Login &ensp;| &ensp;Register</Link>
                }
              </div>
            </div>
          </div >
        </nav >
      </div >
      <managerContext.Provider value={{ db: db, setDb: setDb, isLogin: isLogin, setIsLogin: setIsLogin, alignCenterStyle: align_center_style }}>
        <Switch>
          <Route path="/connect">
            {!isLogin ? <Connect /> :
              <Redirect replace to="/records" />
            }
          </Route>
          <Route path="/records">
            {isLogin ? <Records /> :
              <Redirect replace to="/connect" />
            }
          </Route>
          <Route path="/add-record">
            {isLogin ? <AddRecord />
              : <Redirect replace to="/connect" />
            }
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </managerContext.Provider>
    </Router>
  )
}

export default App
