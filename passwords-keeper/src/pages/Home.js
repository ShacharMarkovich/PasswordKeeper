import React from 'react'
import { managerContext } from '../App.js'

function Home() {
    const manager_context = React.useContext(managerContext)
    return <h1 style={manager_context.alignCenterStyle}>This is the 'Home' page</h1>
}

export default Home
