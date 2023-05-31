# Simple AI Chatbot supported by OpenAI GPT2

## Description
This project is a full-stack web page hosting an AI chatbot. The frontend is built with React.js, the backend is supported by Python Flask and Pinecone vector database.


## Table of Content
- [Installation](#installation)
- [Usage](#usage)
- [Machine Learning Features](#mlfeatures)
- [Future Deployment](#deployment)

## Installation
After clone or download the repo, you can now host the chatbot on your local computer.

The frontend server and backend server need to be run seperately.
To run frontend server:
```
cd react-flask-app
yarn install
yarn start
```
By default, frontend server is opened to portal 3000.

The backend server needs to be run in a python virtual enviornment, so to run backend server:
```
cd react-flask-app/chatbot
python -m venv env
source env/bin/activate
pip install -r requirements.txt
yarn start-api
```
By deafult, backend server is opened to portal 5000.

### Note
To run the word embedding feature at backend properly, you have to create an OpenAI API on your own from https://platform.openai.com/account/api-keys and paste that api key to ```/chatbot/.evn```.

## Usage
Once the website is running, it's the time to explore and chat with the AI assistant. 
    
![alt text](./assets/usage.png?raw=true "Screenshot")
    
After clicking the "talk to assistant" button, type in anything you want to ask Jarvis in the input box and wait couple of seconds for their answer.

## Machine Learning Features
The chatbot is supported by the language model GPT2 created by OpenAI. Currently, the bot is using a pre-trained version of GPT2 provided by HuggingFace (https://huggingface.co/gpt2) without extra training for specific topics, so the generated responses may seemed arbitrary.  

When user inputs a question or sentence, the text is collected and converted to word embedding via an OpenAI Word Embedding API intergrated in the Pinecone Vector Database, which is a cloud-based database specialized in machine learning related data storage. The embedding is uploaded to the Pinecone database, such that it can be queried for further usage.

## Future Deployment
This lightweight web application can be deployed with great flexibility, yet I would recommend deploying the app on cloud-based app service platform, for example, Amazon AWS and Microsoft Azure. Cloud-based web deployment is budget-efficient especially for a startup circumstance. It minimizes the capital expendature such as expenses incurred by hardware purchasing and maintainese efforts. Cloud-based deployment also retains the security as on-premises deployment but in addition provides great scalability, which is essential for a expanding buiness. Since I'm more experience with Azure, I will focusing explaining its deployment on Azure Web App Service, but the same logic applies to AWS EC2.

For portability and reusability, the app needs first to be containerized, a popular option for containerization would be Docker. 2 seperate docker containers are required to host frontend and backend server respectively. In the dockerfile, one needs first to install both the language environment,i.e., Python for backend and Node.js for frontend, then install the proper requirements, set environmental variables, i.e., secrete api keys, and finally call the command to run server. After completed dockerfile, build a image and upload the image to Azure Container Registry. Azure Web App Service now can host the app directly from running the images.

Last but not the least, Azure Web App Service provides Virtual Network gateway that connects the application network with any on-premises private network securely without exposing to the public Internet, such that it enables the application to integrate with future machine learning models that requires training in local environment.
