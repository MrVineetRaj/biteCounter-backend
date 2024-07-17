window.onload = async function() {
    try {
        const response = await fetchWithAuth('/user/me');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const user = await response.json();

        document.getElementById('name').textContent = user.name;
        document.getElementById('email').textContent = user.email;
        document.getElementById('age').textContent = user.age;
        document.getElementById('weight').textContent = user.weight;
        document.getElementById('height').textContent = user.height;
        document.getElementById('activity').textContent = user.activity;

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};


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