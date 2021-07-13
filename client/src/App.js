import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import ChatRoom from './routes/ChatRoom';
import SignUp from './components/SignUp'
import {LogIn} from './components/LogIn'

// this js is handling all type of route requests

// front page is the login path have the path "sitename" + "/" after that just doing the internal routing

const App = () => {
    return (

          <BrowserRouter>
            <Switch>
              <Route path="/" exact component={LogIn} />  
              <Route path="/sign-up" exact component={SignUp} />
              <Route path='/createroom/:name' exact component={CreateRoom} />
              <Route path="/room/:roomID"  component={ChatRoom} />
            </Switch>
          </BrowserRouter>
    )

}

export default App
