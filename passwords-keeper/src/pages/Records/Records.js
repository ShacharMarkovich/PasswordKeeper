import React, { useEffect } from 'react'
import { managerContext } from '../../App.js'
import ShowPassword from './ShowPassword.js'
import DeleteRecord from './DeleteRecord.js'

function Records() {
    const manager_context = React.useContext(managerContext)

    useEffect(() => {
        /* in this useEffect we send HTTP-GET request to the flask backend server,
        asking for it all the user related data in the database*/
        fetch('/all-data').then(res => res.json())
            .then(data => manager_context.setDb(data))
    }, [])


    // check if this user has any data in his table
    if (Object.keys(manager_context.db).length === 0)
        return (
            <div class="article-title ">
                <h1 class="article-metadata">Records</h1><br></br>
                <h5>No records yet.</h5>
            </div>)

    return (
        <div style={manager_context.alignCenterStyle} >
            <br></br>
            <h1 class="article-metadata">Records</h1>
            <br></br>
            <table>
                <thead>
                    <tr>
                        <th > &emsp;Url</th>
                        <th > &emsp;Email</th>
                        <th > &emsp;Username</th>
                        <th > &emsp;Password</th>
                    </tr>
                </thead>
                <tbody>
                    {manager_context.db.map(element => {
                        return (<tr key={element['id']}>
                            <td ><input className="list-group-item" size="15" disabled="true"
                                type="text" value={element['url']} /></td>
                            <td ><input className="list-group-item" size="15" disabled="true"
                                type="email" value={element['email']} /></td>
                            <td ><input className="list-group-item" size="15" disabled="true"
                                type="username" value={element['username']} /></td>
                            <td ><input id={`pass${element['id']}`} className="list-group-item" size="15" disabled="true"
                                type="password" value={element['password']} /></td>
                            <td><ShowPassword recordId={`pass${element['id']}`} /></td>
                            <td ><DeleteRecord recordId={element['id']} /></td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div >
    )
}

export default Records
