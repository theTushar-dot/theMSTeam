import React from 'react'
import ReactDOM from 'react-dom'




import App from './App'
// import RoomContextProvider from './routes/room';
// import './styles.css'



ReactDOM.render(
    // <ContextProvider>
    //     <App />
    // </ContextProvider>,
    <React.StrictMode>
        {/* <RoomContextProvider> */}
        <App />
        {/* </RoomContextProvider>, */}
  </React.StrictMode>,
 document.getElementById('root'))