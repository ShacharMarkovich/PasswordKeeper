import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { managerContext } from '../../App.js'
import { useHistory } from 'react-router-dom';
var md5 = require('md5');

function RegisterForm() {
    const history = useHistory()
    const manager_context = React.useContext(managerContext)

    const [registerMsg, setRegisterMsg] = useState("")


    const { register, errors, handleSubmit, watch } = useForm({})
    const password = useRef({})
    password.current = watch("password", "")
    const onSubmit = async data => {
        delete data['Password_confirm']
        data['password'] = md5(data['password'])
        fetch('/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
            if (data["status"] === "success") {
                setRegisterMsg("")
                manager_context.setIsLogin(true)
                history.push("/records")
            }
            else
                setRegisterMsg(data["description"])
        })
    };

    return (
        <div class="content-section" >
            <h3 class="article-metadata"> Register</h3>
            <br></br>
            <form onSubmit={e => e.preventDefault()}>
                <label>Email</label>
                <input class="list-group-item" type="email" placeholder="example@email.com" name="email" ref={register({
                    required: "You must specify an Email",
                    maxLength: { value: 50, message: "Email must have no morw then 50 characters" },
                    pattern: { value: /^\S+@\S+$/i, message: "Email must contain '@'" }
                })} />
                {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                <br></br>

                <label>Password</label>
                <input class="list-group-item" name="password" type="password" placeholder="password" ref={register({
                    required: "You must specify a password",
                    minLength: { value: 8, message: "Password must have at least 8 characters" },
                    maxLength: { value: 50, message: "Password must have no morw then 50 characters" }
                })}
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                <br></br>


                <label>Repeat Password</label>
                <input class="list-group-item" name="Password_confirm" type="password" placeholder="repeat password"
                    ref={register({
                        validate: value => value === password.current || "The passwords do not match",
                        required: "You must specify a Repeat password",
                        minLength: { value: 8, message: "Password must have at least 8 characters" },
                        maxLength: { value: 50, message: "Password must have no morw then 50 characters" }
                    })}
                />
                {errors.Password_confirm && <p style={{ color: 'red' }}>{errors.Password_confirm.message}</p>}
                <br></br>
                {registerMsg !== "" && <p style={{ color: 'red' }}>{registerMsg}</p>}
                <input class="btn" type="submit" onClick={handleSubmit(onSubmit)} value="Sign Up" />
            </form>
        </div>
    )
}

export default RegisterForm