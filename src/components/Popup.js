import React from 'react';
import Chatbot from './Bot.js';
// styling
import './Popup.css';
// images
// import bone from './bone.png'

const PopUp = props => {
    // function that takes boolean as param to conditionally display popup
    const { setPopUp } = props 

    return (
        <div className="PopUp">
            {/* x close window */}
            <button className="popup-x" onClick={()=> setPopUp(false)} >X</button>
            <div className="pu-content-container">
                <Chatbot></Chatbot>
            </div>
        </div>
    );
}

export default PopUp;