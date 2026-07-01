const allUser = JSON.parse(localStorage.getItem('users')) || []
const logIn = () => {
    const email = document.getElementById('address').value
    const password = document.getElementById('word').value

    if(email.trim() === '' || password.trim() === ''){
        alert('kindly fill in the inputs')
    } else if (!allUser.find(u=>u.email === email)){
        alert(`No Record found for this email...Proceed to signup page`);
        setTimeout(() => {
            windowlocation.href = 'signup.html'
        }, 1000);
    } else{
        const user = allUser.find(u =>u.email === email && u.password ===password)
        if (user) {
            document.getElementById('login').textContent = 'wellcome';
            localStorage.setItem('currentUser', email); 
            setTimeout(() => {
                window.location.href = 'dashboard.html'
            }, 2000);
        } else {
            alert('invalid email and password')
        }
    }

    
}