// const email = document.getElementById("email")
// const message = document.getElementById("message")

// function validateEmail() {
// if (email.value.trim() === '') {
//         message.style.display = "block"
//       message.innerHTML = `<div class="alert alert-danger p-2 fw-bold text-center" role="alert">Enter your email address!</div>`
//       message.style.color = "red"
//       setTimeout(() => {
//         message.style.display = "none"
//       }, 2500);
//     } else{
//         message.innerHTML = "✅ Email address is valid"
//         message.style.color = "green"
//     }
// }

const allUsers =JSON.parse(localStorage.getItem('users')) ||[]
const allUsersObj = {
  email: '',
  fname: '',
  lname: '',
  username: '',
  phone: '',
  password: '',
  pin: ''
}
const validateEmail = () => {
    const email = document.getElementById('email').value.trim()
    const message = document.getElementById("message")
    
   if (email === '') {
        message.style.display = "block"
      message.innerHTML = `<div class="alert alert-danger p-2 fw-bold text-center" role="alert">Enter your email address!</div>`
      message.style.color = "red"
      setTimeout(() => {
        message.style.display = "none"
      }, 2500);

    } else {
       
      // alert('Bello')

      const found = allUsers.find(u=>u.email === email)

      if (found) {
        alert('Email Exist')
      } else {
        allUsersObj.email = email;
        allUsersObj.username = `@${email.slice(0, email.indexOf('@'))}`;
        allUsers.push(allUsersObj)

        localStorage.setItem('users', JSON.stringify(allUsers))
        localStorage.setItem('currentUser', email)
        alert('Reg successful')
        
        window.location.href='profile.html'
        
      }
      // } else {
      //   message.innerHTML = "✅ Email address is valid"
      //   message.style.color = "green"

      //   window.location.href='profile.html'
      // }
        
    }

}


