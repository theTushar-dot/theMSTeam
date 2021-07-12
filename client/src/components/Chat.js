import React from 'react'

const Chat = ({ partis, sendmess, v_on}) => {

    return(
    <div>

    <div class="main__right">
        <button onClick={v_on}>click</button>
                <div class="main_counter">
                    <h2>{partis}</h2>
                </div>
                <div class="main__header">
                    <h2>Message</h2>
                </div>
                <div class="main__chat_window">
                    <ul class="messages" id='messShow'>
            
                    </ul>
                    {/* <button onClick={juston}>Hello</button> */}

                </div>
                <div class="main__message_container">
                    <input id="chat_message" type="text" placeholder="Type message here..."/>
                    <button onClick={sendmess}>send</button>
                </div>
            </div>

</div>)

}

export default Chat