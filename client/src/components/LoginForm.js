import {useState} from 'react'
import axios from 'axios'


const LoginForm = ({setUser}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    /*
    username
    password
    */
    const login = async credentials => {
        const res = await axios.post(
            '/api/login/', credentials
        )
        return res.data
    }
    const handleLogin = async (loginEvent) => {
        loginEvent.preventDefault()
        try {
            const user = await login(
                {username, password}
            )
            console.log(`logging in with ${JSON.stringify(user)}`)
            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
                )
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (err){
            alert('wrong username or password')
        }

    }

    return (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    type={"text"}
                    value={username}
                    name="username"
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type={"password"}
                    value={password}
                    name="password"
                    onChange={({target}) => setPassword(target.value)}
                    />
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
    )
}

export default LoginForm