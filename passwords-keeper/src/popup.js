import ReactDOM from 'react-dom';
import React from 'react';
import AddRecord from './pages/Records/AddRecord';
import LoginForm from './pages/Connect/LoginForm';
import { managerContext } from './App';
import * as serviceWorker from './serviceWorker';

function Popup() {
    const manager_context = React.useContext(managerContext)

    return (<> HEllo!{manager_context.isLogin ? <AddRecord /> : <LoginForm />}</>)
}

ReactDOM.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>,
    document.getElementById('popupDiv')
);

serviceWorker.unregister();
