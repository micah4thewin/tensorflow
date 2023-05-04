import * as tf from '@tensorflow/tfjs';
import * as qna from '@tensorflow-models/qna';
import Typed from 'typed.js';
import localforage from 'localforage';
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// DOM elements
const contextTextArea = document.getElementById('context');
const questionInput = document.getElementById('question');
const getAnswerButton = document.getElementById('get-answer');
const messages = document.querySelector('.messages');
const sidebar = document.querySelector('.sidebar');
const newChatButton = document.getElementById('new-chat');
const toggleSidebar = document.getElementById('toggle-sidebar');
const sidebarCard = document.querySelector('.sidebar');
const clearChatsButton = document.getElementById('clear-chats');

// Set initial context
contextTextArea.value = `Questions: Hello? Answer: Hi!, My full name is Micah David Levason. I have one older brother named Stefan, one younger brother named Aaron and a little sister whose name is Grace. I was born in Salem, Oregon and live in the Pacific Northwest with my wife Stephanie and my two dogs whose names are Casey and Ata. My father's name was Scott and my mother's name was Cindee. I grew up in several different states on the west coast of the US.  I am studying computer science at the University of Phoenix. My current occupation and profession is the role of Tech Expert for T-Mobile. My job is to provide technical support to T-Mobile customers. As a side business I make money designing websites and web applications for clients who want to stand out from the crowd. Some of my skills and qualifications are using es6 JavaScript, my ability to build web applications using technologies like AWS Amplify, Bootstrap and Webpack.`;

// Load the QnA model
async function loadModel() {
  const model = await qna.load();
  return model;
}

const modelPromise = loadModel();

// Get the answer to the question
async function getAnswer(model, context, question) {
  const answers = await model.findAnswers(question, context);
  return answers[0]?.text || 'No answer found.';
}

// Conversations array and the current conversation
let conversations = [];
let currentConversation = null;

// Helper function to create a new conversation
function createNewConversation(question, answer) {
  const conversation = {
    id: Date.now(),
    questions: [question],
    answers: [answer],
  };

  conversations.push(conversation);
  currentConversation = conversation;
}

// Add a chat to the sidebar
function addChatToSidebar(conversation) {
  // Check if the conversation is already in the sidebar
  const existingChatItem = document.querySelector(`.chat-item[data-conversation-id="${conversation.id}"]`);
  if (existingChatItem) {
    return; // Do not add a new DOM element if the conversation already exists in the sidebar
  }

  const chatItem = document.createElement('div');
  chatItem.classList.add('chat-item');
  chatItem.dataset.conversationId = conversation.id;
  chatItem.textContent = conversation.questions[0]; // Show the first question as the title

  chatItem.addEventListener('click', () => {
    messages.innerHTML = '';

    conversation.questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.classList.add('question');
      questionElement.innerText = question;

      const answerElement = document.createElement('div');
      answerElement.classList.add('answer');
      answerElement.innerText = conversation.answers[index];

      messages.appendChild(questionElement);
      messages.appendChild(answerElement);
    });
  });

  sidebar.appendChild(chatItem);
}

getAnswerButton.addEventListener('click', async () => {
  const model = await modelPromise;
  const context = contextTextArea.value;
  const question = questionInput.value;
  const answer = await getAnswer(model, context, question);

  if (!currentConversation) {
    // Create a new conversation if there is none
    createNewConversation(question, answer);
  } else {
    // Update the current conversation with the new question and answer
    currentConversation.questions.push(question);
    currentConversation.answers.push(answer);
  }

  localforage.setItem(currentConversation.id.toString(), currentConversation);

  addChatToSidebar(currentConversation);

  const questionElement = document.createElement('div');
  questionElement.classList.add('question');
  questionElement.innerText = question;

  const answerElement = document.createElement('div');
  answerElement.classList.add('answer');

  const typed = new Typed(answerElement, {
    strings: [answer],
    typeSpeed: 30,
    showCursor: false,
  });

  messages.appendChild(questionElement);
  messages.appendChild(answerElement);

  questionInput.value = '';
});

// New chat button event listener
newChatButton.addEventListener('click', () => {
  // Create a new conversation when the new chat button is clicked
  currentConversation = null;
  messages.innerHTML = '';
});

// Toggle sidebar event listener
toggleSidebar.addEventListener('click', () => {
  sidebarCard.style.display = sidebarCard.style.display === 'none' ? 'block' : 'none';
});

// Clear chats button event listener
clearChatsButton.addEventListener('click', () => {
  // Clear the conversations array and reset the current conversation
  conversations = [];
  currentConversation = null;

  // Remove all chat items from the sidebar
  const chatItems = document.querySelectorAll('.chat-item');
  chatItems.forEach(chatItem => chatItem.remove());

  // Clear the messages area
  messages.innerHTML = '';

  // Clear stored conversations in localforage
  localforage.clear();
});

// Load conversations from storage
async function loadConversationsFromStorage() {
  await localforage.iterate((value, key) => {
    if (typeof value === 'object' && value !== null && 'questions' in value && 'answers' in value) {
      const conversation = value;
      conversations.push(conversation);
      addChatToSidebar(conversation);
    }
  });
}

// Load conversations when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  loadConversationsFromStorage();
});
