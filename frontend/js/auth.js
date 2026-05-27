document.addEventListener('DOMContentLoaded', function () {

    const signinForm =
        document.getElementById('signinForm');

    const signupForm =
        document.getElementById('signupForm');

    if (signinForm) {

        signinForm.addEventListener(
            'submit',
            handleSignIn
        );

    }

    if (signupForm) {

        signupForm.addEventListener(
            'submit',
            handleSignUp
        );

    }

});



/* =========================
   SIGN IN
========================= */

function handleSignIn(e) {

    e.preventDefault();

    const email =
        document.getElementById('email').value;

    const password =
        document.getElementById('password').value;

    const roleElement =
        document.getElementById('role');

    const role =
        roleElement ? roleElement.value : '';



    const users =
        JSON.parse(
            localStorage.getItem('users') || '[]'
        );



    const user = users.find(

        u =>

            u.email === email &&
            u.password === password &&
            (
                !role ||
                u.role === role ||
                u.userType === role
            )

    );



    if (user) {

        localStorage.setItem(
            'isLoggedIn',
            'true'
        );

        localStorage.setItem(
            'user',
            JSON.stringify(user)
        );

        localStorage.setItem(
            'userName',
            user.fullName
        );

        localStorage.setItem(
            'userEmail',
            user.email
        );

        localStorage.setItem(
            'userRole',
            user.role || user.userType
        );



        showNotification(
            'Login successful! Redirecting...',
            'success'
        );



        setTimeout(() => {

            const userRole =
                user.role || user.userType;



            if (userRole === 'customer') {

                window.location.href =
                    'customer-dashboard.html';

            }

            else if (userRole === 'lawyer') {

                window.location.href =
                    'lawyer-dashboard.html';

            }

            else if (userRole === 'student') {

                window.location.href =
                    'student-dashboard.html';

            }

            else {

                window.location.href =
                    'index.html';

            }

        }, 1000);

    }

    else {

        const userExists =
            users.some(u => u.email === email);

        if (userExists) {

            showNotification(
                'Incorrect password or role',
                'error'
            );

        }

        else {

            showNotification(
                'Account not found. Please sign up first.',
                'error'
            );

        }

    }

}



/* =========================
   SIGN UP
========================= */

function handleSignUp(e) {

    e.preventDefault();

    const fullName =
        document.getElementById('fullName').value;

    const email =
        document.getElementById('email').value;

    const password =
        document.getElementById('password').value;



    const roleElement =
        document.getElementById('role');

    const userTypeElement =
        document.getElementById('userType');



    const role =
        roleElement
            ? roleElement.value
            : userTypeElement.value;



    const phoneElement =
        document.getElementById('phone');

    const bioElement =
        document.getElementById('bio');



    const phone =
        phoneElement ? phoneElement.value : '';

    const bio =
        bioElement ? bioElement.value : '';



    if (!fullName || !email || !password) {

        showNotification(
            'Please fill in all fields',
            'error'
        );

        return;

    }



    if (password.length < 6) {

        showNotification(
            'Password must be at least 6 characters',
            'error'
        );

        return;

    }



    const users =
        JSON.parse(
            localStorage.getItem('users') || '[]'
        );



    if (users.some(u => u.email === email)) {

        showNotification(
            'User with this email already exists',
            'error'
        );

        return;

    }



    const newUser = {

        id: Date.now(),

        fullName,

        email,

        password,

        role,

        userType: role,

        phone,

        bio,

        appointments: [],

        internships: [],

        totalCases: 0,

        casesWon: 0,

        createdAt: new Date().toISOString()

    };



    users.push(newUser);



    localStorage.setItem(
        'users',
        JSON.stringify(users)
    );



    localStorage.setItem(
        'isLoggedIn',
        'true'
    );



    localStorage.setItem(
        'user',
        JSON.stringify(newUser)
    );



    localStorage.setItem(
        'userName',
        fullName
    );



    localStorage.setItem(
        'userEmail',
        email
    );



    localStorage.setItem(
        'userRole',
        role
    );



    showNotification(
        'Account created successfully!',
        'success'
    );



    setTimeout(() => {

        if (role === 'customer') {

            window.location.href =
                'customer-dashboard.html';

        }

        else if (role === 'lawyer') {

            window.location.href =
                'lawyer-dashboard.html';

        }

        else if (role === 'student') {

            window.location.href =
                'student-dashboard.html';

        }

        else {

            window.location.href =
                'index.html';

        }

    }, 1000);

}



/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem('isLoggedIn');

    localStorage.removeItem('user');

    localStorage.removeItem('userName');

    localStorage.removeItem('userEmail');

    localStorage.removeItem('userRole');



    showNotification(
        'Logged out successfully',
        'success'
    );



    setTimeout(() => {

        window.location.href =
            'index.html';

    }, 1000);

}



/* =========================
   CHECK LOGIN
========================= */

function checkAuth() {

    const isLoggedIn =
        localStorage.getItem('isLoggedIn');



    if (!isLoggedIn) {

        window.location.href =
            'signin.html';

    }

}



/* =========================
   GET CURRENT USER
========================= */

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem('user')
    );

}



/* =========================
   NOTIFICATION
========================= */

function showNotification(message, type) {

    const notification =
        document.createElement('div');



    notification.innerText = message;



    notification.style.position =
        'fixed';

    notification.style.top =
        '20px';

    notification.style.right =
        '20px';

    notification.style.padding =
        '15px 25px';

    notification.style.borderRadius =
        '10px';

    notification.style.color =
        'white';

    notification.style.fontWeight =
        'bold';

    notification.style.zIndex =
        '9999';

    notification.style.boxShadow =
        '0 5px 20px rgba(0,0,0,0.2)';



    if (type === 'success') {

        notification.style.background =
            '#16a34a';

    }

    else {

        notification.style.background =
            '#dc2626';

    }



    document.body.appendChild(notification);



    setTimeout(() => {

        notification.remove();

    }, 3000);

}