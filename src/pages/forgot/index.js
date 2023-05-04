// Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
// AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
// Types
import Typed from 'typed.js';
// Shared
import '../../shared/css/font.css';
import topnav from "../../shared/html/topnav.html";
import footer from "../../shared/html/footer.html";
// Auth
import { userAuthState } from '../../app/auth/auth_user';
import { checkAuthContent } from '../../app/auth/auth_content';
import { signUp, confirmSignUp, resendConfirmationCode } from '../../app/auth/auth_signup';
import { signIn } from '../../app/auth/auth_login';
import { forgotPass, confirmForgotPass } from '../../app/auth/auth_forgot_password';
import { signOut } from '../../app/auth/auth_logout';


document.addEventListener('DOMContentLoaded', () => {
  // Insert topnav HTML as the first child of the body
  const topnavElement = document.createElement('div');
  topnavElement.innerHTML = topnav;
  document.body.insertBefore(topnavElement, document.body.firstChild);

  // Initialize AOS
  AOS.init();

  // Initialize Typed.js
  const typedElement = document.querySelector('#typed-text');
  if (typedElement) {
    const typed = new Typed('#typed-text', {
      strings: ['This is the home page.', 'It is great for content about your and/or your organization.'],
      typeSpeed: 100,
      loop: true,
      loopCount: Infinity,
    });
  }
  // Copyright
  const setCopyrightYear = () => {
    const currentYear = new Date().getFullYear();
    document.querySelector('#copyright-year').textContent = currentYear;
  };

  // Insert footer HTML as the last child of the body
  const footerElement = document.createElement('div');
  footerElement.innerHTML = footer;
  document.body.appendChild(footerElement);


  // Dynamic Auth Button for login/logout
  const updateAuthButton = (isAuthenticated) => {
  const authButton = document.getElementById('authButton');

  if (isAuthenticated) {
    authButton.textContent = 'Logout';
    authButton.addEventListener('click', () => {
      signOut().then(() => {
        window.location.href = '/';
      });
    });
  } else {
    authButton.textContent = 'Login';
    authButton.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }
};

userAuthState()
  .then((data) => {
    console.log('user is authenticated: ', data);
    updateAuthButton(true);
  })
  .catch((error) => {
    console.log('user is not authenticated: ', error);
    updateAuthButton(false);
  });

  // Set copyright year
  setCopyrightYear();
});
