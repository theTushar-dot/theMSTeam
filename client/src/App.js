import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from './routes/room';
import ChatRoom from './routes/ChatRoom';
import Exits from './routes/Exits';
import SignUp from './components/SignUp'
import {LogIn} from './components/LogIn'
// import 'bootstrap/dist/css/bootstrap.min.css';



const App = () => {
    return (

          <BrowserRouter>
            <Switch>
              {/* <Route path="/" exact component={LogIn} />  */}
              {/* <Route path="/sign-up" exact component={SignUp} /> */}
              {/* <Route path='/createroom/:name' exact component={CreateRoom} /> */}
              <Route path='/' exact component={CreateRoom} />
              <Route path="/room/:roomID"  component={ChatRoom} />
              {/* <Route path="/video/:roomID" component={Room} /> */}
              <Route path="/exits/" component={Exits} />
            </Switch>
          </BrowserRouter>
    )

}

export default App
