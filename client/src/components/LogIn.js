import React,  {useState} from "react"
import { Link} from "react-router-dom";
import axios from 'axios'
import himg from './image/msteams.png'

import './authcss.css'


// LogIn 

const LogIn = (props) => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const onChangeUserEmail = (e) =>{
        setEmail(e.target.value)
    }

    const onChangeUserPass = (e) =>{
        setPass(e.target.value)
    }


    const loging_in = (e) => {
        e.preventDefault()
    
        axios.get(`http://localhost:5000/users/login/${email}`) // checking if the user exits in th database or not
        .then((res) => {
            console.log(res.data)
            if (pass == res.data.password){
                props.history.push(`/createroom/${res.data.name}`)
           
            }
        }).catch((error) => {
            console.log(error)
        });

        setEmail('')
        setPass('')
    }

    return(
        <div class="teams-wrapper">
                <h3>Microsoft Teams</h3> 
                <div class="teams-container">
                    <div class="signin-logo">
                        <img src={himg}/>
                    </div>

                    <div class="signin-title">
                        <h2>Enter your work, school,
                            or Microsoft account.</h2> 
                    </div>
                    
                    <div class="signin-container">
                        <form>
                            <div class="signin-input">
                                <input type="email" value={email} onChange={onChangeUserEmail} placeholder="Sign-in address" required id="input-email"/>
                            </div>
                            <div class="signin-input">
                                <input type="password"  value={pass} onChange={onChangeUserPass}  placeholder="  Password" required id="input-password"/>
                            </div>
                            <div class="btn">
                                <button onClick={loging_in}>Sign in</button>
                            </div>
                        </form>
                    </div>  
                </div>
             <p className="forgot-password text-right">
                    new user?? <Link to={"/sign-up"}>SignUp</Link>
                </p>
        </div>


    )
}




export {LogIn, mail_id}