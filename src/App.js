import React from 'react';
import gsap from 'gsap';
import { useRef, useState} from 'react';
import { useLayoutEffect } from 'react';
import './App.css';
import PopUp from './components/Popup.js';

function App() {
  // controls if popup displays
  const [popUp, setPopUp] = useState(false)
  const duringPopUp = popUp ? " during-popup" : ""

  return (
    <div className="App" >

      <div class="ctr">
        <div class="left-ctr">
          <div class="left-ctr-1">
            <span>
              <h1>ABC Co.</h1>
            </span>
            <span>
              <h1>Retail Company</h1>
            </span>
          </div>
          <div class="left-ctr-2">
            <div class="left-ctr-2-1">
              <p>
                ABC Co. is a retail company offering sophisticated services to the customers. Feel free to try the AI chat bot by clicking the button on the right!
              </p>
            </div>
          </div>
        </div>

        <div class="right-ctr">
          <div class="right-ctr-box">
              <button onClick={()=>setPopUp(true)} className={duringPopUp}>Talk to AI Assistant!</button>
          </div>
        </div>
      </div>
      {popUp && <PopUp setPopUp={setPopUp}/>}

    </div>
  );
}
 
export default App