const signUpToLogin = document.getElementById("signUpToLogin")
const loginToSignUp = document.getElementById("loginToSignUp")

const slide1 = document.querySelector(".slide1");
const slide2 = document.querySelector(".slide2");
loginToSignUp.addEventListener('click',()=>{
    slide1.classList.remove('active');
    slide1.classList.add('inactive');
    slide2.classList.add('active');  
    slide2.classList.remove('inactive');  
})
signUpToLogin.addEventListener('click',()=>{
    slide2.classList.remove('active');
    slide2.classList.add('inactive'
    );
    slide1.classList.remove('inactive');
    slide1.classList.add('active');
    
})

const labels = document.querySelectorAll('.form_control label');

labels.forEach(label =>{
    label.innerHTML = label.innerText
    .split('')
    .map((letter,index)=> `<span style="transition-delay:${index*50}ms"> ${letter} </span>`)
    .join('')
})