import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { managerContext } from '../../App.js'
import CryptoJS from 'crypto-js'
import { useHistory } from 'react-router-dom';

function AddRecord() {
    const manager_context = React.useContext(managerContext) // context that containe all the data that go thourgh the children comps
    const history = useHistory()

    const { register, handleSubmit, errors } = useForm();   // add Record's form

    const [enc_key, set_enc_key] = useState("not working") // encrypt key state

    useEffect(() => {
        // this useEffect send POST request to the backend server, 
        // and get the hashed password of the current login user.
        fetch('/hash', {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify("{}")
        }).then(res => res.json()).then(data => set_enc_key(data['hashed']))
    }, [])


    const onSubmit = data => {
        // this function handle the submition of the new record:

        // get the encrypt key and encrypt the record's password
        data['password'] = CryptoJS.AES.encrypt(data['password'], enc_key).toString();

        // send POST request with the new record,
        // the backend server and it to the db and return the updated table, and render it.
        fetch('/add-record', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
            manager_context.setDb(data)
            history.push("/records")
        })
    }


    return (
        <div style={manager_context.alignCenterStyle} >
            <h3 class="article-metadata"> Add Record</h3>
            <p >Please fill the data below:</p>
            <form class="content-section">
                <label>URL</label>
                <input class="list-group-item" type="url" placeholder="http://www.example.com" name="url"
                    ref={register({
                        required: "You must specify an URL",
                        pattern: {
                            value: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w-]+)+[\w\-_~:/?#[\]@!&',;=.]+$/,
                            message: "URL not in the right pattern"
                        }
                    })} />
                {errors.url && <p style={{ color: 'red' }}>{errors.url.message}</p>}
                <br></br>

                <label>Email</label>
                <input class="list-group-item" type="email" placeholder="example@email.com" name="email" ref={register({
                    required: "You must specify an Email",
                    maxLength: { value: 50, message: "Email must have no morw then 50 characters" },
                    pattern: { value: /^\S+@\S+$/i, message: "Email must contain '@'" }
                })} />
                {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                <br></br>

                <label>Username</label>
                <input class="list-group-item" type="text" placeholder="username" name="username"
                    ref={register({ maxLength: { value: 20, message: "username must have no morw then 20 characters" } })} />
                {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
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

                <input class="btn" type="submit" onClick={handleSubmit(onSubmit)} value="Add Record" />
            </form>
        </div>
    )
}

export default AddRecord