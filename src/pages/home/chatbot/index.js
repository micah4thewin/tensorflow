import * as tf from '@tensorflow/tfjs';
import * as qna from '@tensorflow-models/qna';
import Typed from 'typed.js';
import localforage from 'localforage';

const contextTextArea = document.getElementById('context');
const questionInput = document.getElementById('question');
const getAnswerButton = document.getElementById('get-answer');
const messages = document.querySelector('.messages');
const sidebar = document.querySelector('.sidebar');

contextTextArea.value = `My full name is Micah David Levason. I have one older brother named Stefan, one younger brother named Aaron and a little sister whose name is Grace. I was born in Salem, Oregon and live in the Pacific Northwest with my wife Stephanie and my two dogs whose names are Casey and Ata. My father's name was Scott and my mother's name was Cindee. I grew up in several different states on the west coast of the US.  I am studying computer science at the University of Phoenix. My current occupation and profession is the role of Tech Expert for T-Mobile. My job is to provide technical support to T-Mobile customers. As a side business I make money designing websites and web applications for clients who want to stand out from the crowd. Some of my skills and qualifications are using es6 JavaScript, my ability to build web applications using technologies like AWS Amplify, Bootstrap and Webpack.`;

let conversations = [];

async function loadModel() {
  const model = await qna.load();
  return model;
}

async function getAnswer(model, context, question) {
  const answers = await model.findAnswers(question, context);
  return answers[0]?.text || 'No answer found.';
}

const modelPromise = loadModel();

function displayConversation(conversation) {
  messages.innerHTML = '';

  conversation.forEach(chat => {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerText = chat.question;

    const answerElement = document.createElement('div');
    answerElement.classList.add('answer');
    answerElement.innerText = chat.answer;

    messages.appendChild(questionElement);
    messages.appendChild(answerElement);
  });
}

function addConversationToSidebar(conversation) {
  const conversationItem = document.createElement('div');
  conversationItem.classList.add('conversation-item');
  conversationItem.textContent = conversation[0].question;

  conversationItem.addEventListener('click', () => {
    displayConversation(conversation);
  });

  sidebar.appendChild(conversationItem);
}

getAnswerButton.addEventListener('click', async () => {
  const model = await modelPromise;
  const context = contextTextArea.value;
  const question = questionInput.value;
  const answer = await getAnswer(model, context, question);

  const chat = { question, answer };
  conversations.push([chat]);
  localforage.setItem('conversations', conversations);

  addConversationToSidebar([chat]);

  displayConversation([chat]);

  questionInput.value = '';
});

const toggleSidebar = document.getElementById('toggle-sidebar');
const sidebarCard = document.querySelector('.sidebar');

toggleSidebar.addEventListener('click', () => {
  sidebarCard.style.display = sidebarCard.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('DOMContentLoaded', async () => {
  conversations = (await localforage.getItem('conversations')) || [];
  conversations.forEach(conversation => addConversationToSidebar(conversation));

  if (conversations.length > 0) {
    displayConversation(conversations[0]);
  }
});
