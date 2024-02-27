const $loginForm = document.querySelector("#login-form")

$loginForm.onsubmit = async (e) => {
    e.preventDefault()
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    alert(email)
    const data = await loginUser(email, password)
        .then((data) => {
            alert(`${data.user.name} logged in`)
            window.location.href = data.redirect
        })
        .catch(error => alert(error));

    // alert(data.user.age);//This is not working


}

// Function to log in a user
async function loginUser(email, password) {
    const response = await fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json(); // Parse the JSON response body

    // Store the token in local storage
    localStorage.setItem('authToken', data.token);
    return data;
}

// Usage
// loginUser('user@example.com', 'password123')
//     .then(() => console.log('User logged in'))
//     .catch(error => console.error(error));


async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('authToken');

    // Include the Bearer token in the Authorization header
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error('Request failed');
    }

    return response.json();
}