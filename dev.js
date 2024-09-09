const form = document.querySelector("form")

form.addEventListener("submit",(e)=>{
    e.preventDefault()

    const username = form.username.value
    const password = form.password.value

    const authenticated = authentication(username,password)

    if(authenticated){
        window.location.href = "dov.html"
    }else{
        window.location.replace("https://clever.com/oauth/authorize?channel=clever&client_id=4c63c1cf623dce82caac&confirmed=true&district_id=56b4e597ca2cb70100000009&redirect_uri=https%3A%2F%2Fclever.com%2Fin%2Fauth_callback&response_type=code&state=37a27a6c93c6e3039508de9d5f9aac988e7d61f5deb9a827dcbaa427bb4b18a4")
    }
})

// function for checking username and password



function authentication(username,password){
    if(username === "akkal" && password === "bhudi"){
        return true
    }else{
        return false
    }
}
