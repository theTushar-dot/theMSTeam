import React, {useState} from 'react'
import { Link} from "react-router-dom";
import axios from 'axios'
import himg from './image/msteams.png'


// Sign UP page


const SignUp = () =>{
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const onChangeUserName = (e) =>{
        setName(e.target.value)
    }

    const onChangeUserEmail = (e) =>{
        setEmail(e.target.value)
    }

    const onChangeUserPass = (e) =>{
        setPass(e.target.value)
    }



    const siging_up = (e) => {
        e.preventDefault()
        const userObject = {
            name: name,
            email: email,
            password: pass
        }
        axios.post('http://localhost:5000/users/create', userObject)  // adding the new user
        .then((res) => {
            console.log(res.data)
        }).catch((error) => {
            console.log(error)
        });

        setName('')
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
                <br/> or Microsoft account. </h2> 
            </div>
            
            <div class="signin-container">
                <form>
                    <div class="signin-input">
                        <input type="text" value={name} onChange={onChangeUserName} placeholder="Full Name" required id="input-name"/>
                    </div>
                    <div class="signin-input">
                        <input type="email" value={email} onChange={onChangeUserEmail} placeholder="Sign-in address" required id="input-email"/>
                    </div>
                    <div class="signin-input">
                        <input type="text" value={pass} onChange={onChangeUserPass}  placeholder="Password" required id="input-password"/>
                    </div>
                    <div class="btn">
                        <button onClick={siging_up}>Sign up</button>
                    </div>
                </form>
            </div>  
        </div>
    {/* <button class="btn-signup"> Sign up for free</button>
     */}
     <p className="forgot-password text-right">
     Already registered?? <Link to={"/"}>SignIn</Link>
        </p>
</div>



        // <div>
        //     <form>
        //         <h3>Sign Up</h3>

        //         <div className="form-group">
        //             <label>First name</label>
        //             <input type="text" value={name} onChange={onChangeUserName} className="form-control" placeholder="First name" />
        //         </div>

        //         {/* <div className="form-group">
        //             <label>Last name</label>
        //             <input type="text" className="form-control" placeholder="Last name" />
        //         </div> */}

        //         <div className="form-group">
        //             <label>Email address</label>
        //             <input type="email" value={email} onChange={onChangeUserEmail} className="form-control" placeholder="Enter email" />
        //         </div>

        //         <div className="form-group">
        //             <label>Password</label>
        //             <input type="text" value={pass} onChange={onChangeUserPass} className="form-control" placeholder="Enter password" />
        //         </div>

        //         <button type="submit" onClick={siging_up} className="btn btn-primary btn-block">Sign Up</button>
        //         <p className="forgot-password text-right">
        //             Already registered <Link to={"/"}>Login</Link>
        //         </p>
        //     </form>
            
        // </div>
    )
}

export default SignUp


