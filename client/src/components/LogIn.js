import React,  {useState} from "react"
import { Link} from "react-router-dom";
import axios from 'axios'
import himg from './image/msteams.png'

// import 'bootstrap/dist/css/bootstrap.min.css';
import './authcss.css'



const mail_id = [];
window.mail = 'fuck'

const LogIn = (props) => {
    // const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    

    // const onChangeUserName = (e) =>{
    //     setName(e.target.value)
    // }

    const onChangeUserEmail = (e) =>{
        setEmail(e.target.value)
    }

    const onChangeUserPass = (e) =>{
        setPass(e.target.value)
    }


    const loging_in = (e) => {
        e.preventDefault()
        // console.log('name:', name)
        // console.log('Email:',email)

        // const userObject = {
        //     name: name,
        //     email: email
        // }
        axios.get(`http://localhost:5000/users/login/${email}`)
        .then((res) => {
            console.log(res.data)
            if (pass == res.data.password){
                props.history.push(`/createroom/${res.data.name}`)
                // mail_id.push(email)
                

                // console.log('mail ID', mail_id)
                // setEmail_send(email)
            }
        }).catch((error) => {
            console.log(error)
        });

        // setName('')
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
            {/* <button class="btn-signup"> Sign up for free</button>
             */}
             <p className="forgot-password text-right">
                    new user?? <Link to={"/sign-up"}>SignUp</Link>
                </p>
        </div>

                /* {/* <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={name} onChange={onChangeUserName}  className="form-control" placeholder="Enter Name" />
                </div> */

                /* <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={onChangeUserEmail} className="form-control" placeholder="Enter Email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={pass} onChange={onChangeUserPass} className="form-control" placeholder="Enter password" />
                </div> */

                /* <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div> */

                /* <button type="submit" onClick={loging_in} className="btn btn-primary btn-block">LogIn</button>
                <p className="forgot-password text-right">
                    new user?? <Link to={"/sign-up"}>SignUp</Link>
                </p>
            </form> */

        /* </div> */
    )
}




export {LogIn, mail_id}