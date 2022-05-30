import React, { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { managerContext } from '../../App.js'


function Connect() {
    const manager_context = React.useContext(managerContext) // context that containe all the data that go thourgh the children comps
    const [loginOption, setOption] = useState(true)

    return (
        <div style={manager_context.alignCenterStyle}>
            <h3 style={{ "text-align": "center" }} >
                <button class="btn" onClick={() => setOption(true)}>Login</button> or
                <button class="btn" onClick={() => setOption(false)}> Register</button>
            </h3>
            { loginOption ?
                <LoginForm  />
                : <RegisterForm  />
            }
        </div >)
}

export default Connect
