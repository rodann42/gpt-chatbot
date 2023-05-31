import React from 'react';
import './chatbot.css';
import avatar from '../image/bot.png';

class Bot extends React.Component {

  constructor(props) {
      super(props);
           
      this.state = {
          userMessages: [],
          botMessages: [],
          botGreeting: 'Hi there! I am an Jarvise here to help you. Feel free to ask me anything about the company ABC and its products!',
          botLoading: false,
          overlayStatus: '',
          timer: {
              minutes: 30,
              seconds: 0,
          }
      }
  }

  updateTimer = () => {

      this.setState({
          overlayStatus: 'active'
      })
  }

  updateUserMessages = (newMessage) => {

      // Create a new array from current user messages
      var updatedUserMessagesArr = this.state.userMessages;

      // Create a new array from current bot messages
      var updatedBotMessagesArr = this.state.botMessages;

      // Render user message and bot's loading message
      this.setState({
          userMessages: updatedUserMessagesArr.concat(newMessage),
          botLoading: true,
      })

      // send post request containing user message via fetch
      var requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
        }),
      } 
      fetch('/usermsg', requestOptions)
      .then(response => response.json())
      .then(data => {
          console.log('BOT RESPONSE:', data.response);

          var botResponse = data.response;

          // Update state with both user and bot's latest messages
          this.setState({
              botMessages: updatedBotMessagesArr.concat(botResponse),
              botLoading: false,
          })

          
      })
      .catch(function(error) { 
          console.log ('ERROR =>', error);
      });
  }

  showMessages() {

      var userConvo = this.state.userMessages;

      // Show initial bot welcome message
      if (this.state.userMessages.length === 0) {
          return 
      }
      
      var updatedConvo = userConvo.map((data, index)=>{

          var botResponse = this.state.botMessages[index];
          
          return (
              <div className="conversation-pair" key={'convo' + index}> 
                  <UserBubble message={data} key={'u'+index} />
                  <BotBubble message={botResponse} key={'b'+index} />
              </div>
          )
      });

      return updatedConvo;
      
  }

  render() {

      return (
          <div id="app-container">
              
              <div className="convo-container">
                  <BotBubble message={this.state.botGreeting} key="bot-00" />
                  {this.showMessages()}
              </div>
              <UserInput userMessage = {this.state.userMessage} updateUserMessages = {this.updateUserMessages} />
          </div>
          
      )
  }
}

class UserBubble extends React.Component {

  render() {

      return (
          <div className="user-message-container">
              <div className="chat-bubble user">{this.props.message}</div>
          </div>
      )
  }
}


class BotBubble extends React.Component {

  componentDidMount = () => {

      var lastBubble = this.refs.chatBubble;
      lastBubble.scrollIntoView(true);
  }

  render() {

      return (
          <div className="bot-message-container">
              <div className="img-avatar-container">
                  <img className="bot-avatar" src={avatar} alt="bot avatar" />
              </div>
              
              <div className="chat-bubble bot" ref="chatBubble">{this.props.message ? this.props.message : '...'}</div>
          </div>
      )
  }
}

class UserInput extends React.Component {

  handleChange = (event) => {

      if (event.key === 'Enter') {
          var userInput = event.target.value;

          // update state on parent component
          this.props.updateUserMessages(userInput);
          event.target.value = '';
      }
  }
  
  render() {
      return (
          <div className="input-container">
              <input id="chat" type="text" onKeyPress={this.handleChange} placeholder="type in your text to chat" />
          </div>

      )
  }
}

export default Bot;
