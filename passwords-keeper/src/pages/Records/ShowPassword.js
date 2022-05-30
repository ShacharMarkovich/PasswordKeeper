import React, { useState } from 'react'
import CryptoJS from 'crypto-js'
import Popup from 'reactjs-popup'
import { useForm } from 'react-hook-form'

var md5 = require('md5')

// popup msg style:
const popup_msg_style = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#5f788a',
    padding: '50px',
    zIndex: 1000,
    border: "1px solid gray"
}

function ShowPassword({ recordId }) {
    const { register, handleSubmit, errors } = useForm()

    const [enc_pass, setEnc_pass] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const showPasswordHandler = data => {
        let record = document.getElementById(recordId)
        if (record.type === "text") {
            record.type = "password"
            record.value = enc_pass
        }
        else {
            const password = md5(data['password'])
            // taggle showing password handler, get the redord id,
            //hashed the password that the user entered,

            // send a POST request to backend server,
            // there, it check if the password is currect and if this user own this record
            fetch('/show-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hashed_pass: password, record_id: record.id.replace('pass', '') })
            })
                .then(res => res.json())
                .then(data => {
                    if (data["status"] === "success") {
                        record.type = "text"
                        setEnc_pass(record.value) // save the enc password
                        // Decrypt
                        var bytes = CryptoJS.AES.decrypt(record.value, data["description"])
                        record.value = bytes.toString(CryptoJS.enc.Utf8)
                    }
                    else alert(data["description"])
                })
        }
        setIsOpen(false)
    }

    return (
        <td ><Popup trigger={<button class="btn btn-sm"> <img alt="show password eye icon" src="/API/passwordsKepper/static/show_password.png" /></button>}
            on='click' open={isOpen} onOpen={() => setIsOpen(true)}>
            <form style={popup_msg_style} onSubmit={e => e.preventDefault()}>
                <h3 style={{ color: "white" }} class="article-metadata">Please enter your password:</h3>
                <input type="password" placeholder="password here" name="password" ref={register({
                    required: "You must specify a password"
                })} />
                {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                <br></br>

                <input type="submit" value="Submit" onClick={handleSubmit(showPasswordHandler)} />
            </form>
        </Popup></td>
    )
}

export default React.memo(ShowPassword)

