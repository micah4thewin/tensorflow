import { Amplify } from 'aws-amplify';

import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

import { Auth } from 'aws-amplify';

// Sign In function
export const signIn = async ({username, password}) => {
    try {
        const { user } = await Auth.signIn(username, password);
        console.log(user)
        alert("user signed in");
        window.location = '/secret.html'
    } catch (error) {
        console.log('error signing in', error);
        alert(error.message);
        window.location = '/login.html'
    }
}

// Event Listeners if user is on Login page
if (document.querySelector("#auth-login")) {

    document.querySelector("#form-auth-login").addEventListener("click", event => {
        event.preventDefault();
    });

    document.querySelector("#btnLogin").addEventListener("click", () => {
        const username = document.querySelector("#formLoginEmail").value
        const password = document.querySelector("#formLoginPassword").value
        console.log({username, password});
        signIn({username, password});
    });
};
