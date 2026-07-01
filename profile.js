//     const cUser = localStorage.getItem('currentUser')
//      const uName = document.getElementById('username')
//      uName.value = `@${cUser.slice(0, cUser.indexOf('@'))}`




// const allUsers = JSON.parse(localStorage.getItem('users'))||[]
// const account =  () => {
//     const fname = document.getElementById('first').value
//     const lname = document.getElementById('last').value
//     const mail = document.getElementById('email').value
//     const phone = document.getElementById('number').value
//     const pass = document.getElementById('word').value

//     if(fname.trim() === '' || lname.trim() === '' || mail.trim() === '' || phone.trim() === '' || word.trim() === ''){
//         alert('kindly fill in all inputs')
//     } else {
//         const userobj = { firstname, lastname, email, password}
//         console.log(userobj);
        
//         localStorage.setItem('users', JSON.stringify(allUsers))
//     }
// }


const allUsers = JSON.parse(localStorage.getItem('users')) || []

const fetchUsername = () => {
    const username = document.getElementById('username')

     const cUser = localStorage.getItem('currentUser')
            const cU = allUsers.find(u=>u.email === cUser)
            username.value = cU.username;
}

fetchUsername();

const account = ()=> {
    const fname = document.getElementById('first').value
    const lname = document.getElementById('last').value
    const username = document.getElementById('username').value
    const phone = document.getElementById('number').value
    const pass = document.getElementById('word').value

    if(fname.trim() === '' || lname.trim() === '' || username.trim() === '' || phone.trim() === '' || pass.trim() === '')
       alert('kindly fill in all inputs')
     else {
         const found = allUsers.find(user=>user.username === username)
       console.log(found)
       if (found) {
        alert('user already exist')
    } else{
              const cUser = localStorage.getItem('currentUser')
            const cU = allUsers.find(u=>u.email === cUser)
            cU.fname = fname
            cU.lname = lname
            cU.username = username
            cU.phone = phone
            cU.password = pass
            
            // console.log(cU)
        //   allUsers.push(userobj)
            localStorage.setItem('users', JSON.stringify(allUsers))
                        btn.innerHTML = `<div class="spinner-border text-dark" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>`
             setTimeout(() => {
            window.location.href = 'pin.html'
           },2000);
    }
       
    }

}






























