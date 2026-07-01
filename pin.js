const allUsers = JSON.parse(localStorage.getItem('users')) || []

const inputs = document.querySelectorAll(".pin-inputs input");

inputs.forEach((input, index) => {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/[^0-9]/g,'');

        if(input.value && index < inputs.length-1){

            inputs[index+1].focus();

        }

    });

    input.addEventListener("keydown",(e)=>{

        if(e.key==="Backspace" && !input.value && index>0){

            inputs[index-1].focus();

        }

    });

});

const saveButton = document.getElementById("savePin");

saveButton.addEventListener("click", () => {
    // Get all create PIN inputs
    const createPinInputs = document.querySelectorAll(".pin-create");

    // Get all confirm PIN inputs
    const confirmPinInputs = document.querySelectorAll(".pin-confirm");

    // Convert inputs to strings
    const pin = [...createPinInputs].map(input => input.value).join("");
    const confirmPin = [...confirmPinInputs].map(input => input.value).join("");

    // Validation
    if (pin.length !== 4 || confirmPin.length !== 4) {
        alert("Please enter all 4 digits.");
        return;
    }

    if (pin !== confirmPin) {
        alert("PINs do not match.");
        return;
    }

    // Save PIN in localStorage
            const cUser = localStorage.getItem('currentUser')
            const cU = allUsers.find(u=>u.email === cUser)
            cU.pin=pin
            localStorage.setItem('users', JSON.stringify(allUsers))

    alert("PIN saved successfully! Proceed to login!!" 
    );
   window.location.href = 'login.html'
});