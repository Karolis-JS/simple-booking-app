const register = document.getElementsByClassName('register')[0]
const login = document.getElementsByClassName('login')[0]
const main = document.getElementsByClassName('main')[0]
const regInpName = document.getElementById('regInpName')
const regInppass = document.getElementById('regInppass')
const regInppass2 = document.getElementById('regInppass2')
const regBtn = document.getElementById('regBtn')
const regError = document.getElementById('regError')
const logInpName = document.getElementById('logInpName')
const logBtn = document.getElementById('logBtn')
const logError = document.getElementById('logError')
const goToLogBtn = document.getElementById('goToLogBtn')
const goToRegBtn = document.getElementById('goToRegBtn')
const signOut = document.getElementById('signOut')
let inventoryBook = document.getElementsByClassName('inventoryBook')[0]
const addMsgNotification = document.getElementById('addMsgNotification')
const notificationSymbol = document.getElementById('notificationSymbol')
const notificationMsg = document.getElementById('notificationMsg')
const closeNotificationMsg = document.getElementById('closeNotificationMsg')
const notification = document.getElementById('notification')
const bookList = document.getElementById('bookList')
const allUser = document.getElementById('allUser')
const modal = document.getElementById('modal')
const closeModal = document.getElementById('closeModal')
const anotherUserBooks = document.getElementById('anotherUserBooks')
const anotherUserName = document.getElementById('anotherUserName')

let name
let userId

let userData = []

let notificationWasViewed = false

notification.onclick = () => {
    notificationMsg.style.display = "block"
    notificationWasViewed = true
}
closeNotificationMsg.onclick = () => {
    notificationMsg.style.display = "none"
    notificationSymbol.style.display = "none"
}
closeModal.onclick = () => {
    modal.style.display = "none"
}

goToLogBtn.onclick = () => {
    register.style.display = 'none'
    login.style.display = 'flex'
    main.style.display = 'none'

}
goToRegBtn.onclick = () => {
    register.style.display = 'flex'
    login.style.display = 'none'
    main.style.display = 'none'
}

signOut.onclick = () => {
    register.style.display = 'none'
    login.style.display = 'flex'
    main.style.display = 'none'
    notificationMsg.style.display = "none"
    regInpName.value = ""
    regInppass.value = ""
    regInppass2.value = ""

    let notificationViewed = {
        viewed: notificationWasViewed,
        userName: name
    }

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notificationViewed)
    }

    fetch("http://localhost:3000/deleteMsg", options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
    notificationWasViewed = false
    inventoryBook.innerHTML = ""

}

regBtn.onclick = () => {

    let user = {
        name: regInpName.value,
        pass1: regInppass.value,
        pass2: regInppass2.value,
    }

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }

    fetch("http://localhost:3000/createUser", options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.error){
                regError.innerText = data.msg
            } else {
                alert('You have successfully registered!')
                register.style.display = 'none'
                login.style.display = 'flex'
                main.style.display = 'none'
            }
        })

}

logBtn.addEventListener("click", getLoginData)
function getLoginData(){

    name = logInpName.value

    fetch(`http://localhost:3000/checkLogin/${name}`)
        .then(res => res.json())
        .then(data => {
            userId = data.user[0]._id
            console.log(data)
            userData = data
            if (data.error){
                logError.innerText = data.msg
            } else {
                register.style.display = 'none'
                login.style.display = 'none'
                main.style.display = 'flex'
                loginAs.innerText = `Prisijungęs kaip: ${data.user[0].name}`
                if (data.user[0].inventory.length>=1){
                    inventoryBook.innerHTML = ""
                    data.user[0].inventory.map(item => {
                        inventoryBook.innerHTML += `
                <div id="backBookDiv">
                    <div id="yourBook" style="background-image: url('${item}')"></div>
                    <div id="giveBackBtn" onclick="giveBack(event)">Give back</div>
                </div>
                `
                    })
                }

            }

            if (data.user[0].msg.length >=2 ){
                notificationSymbol.style.display = "block"
                notificationSymbol.innerText = `${data.user[0].msg.length-1}`
                addMsgNotification.innerHTML =""
                data.user[0].msg.map(item => {
                    addMsgNotification.innerHTML += `
                    <div>${item}</div>
                    `
                })
            } else {
                notificationSymbol.style.display = "none"
                addMsgNotification.innerHTML =""
                addMsgNotification.innerHTML = `
                    <div>Pranešimų nėra</div>
                    `
            }
        })

    showAvailableBook()

}
function showAvailableBook(){
    fetch("http://localhost:3000/getBook")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.auth){
                register.style.display = 'none'
                login.style.display = 'none'
                main.style.display = 'flex'
                loginAs.innerText = `Prisijungęs kaip: ${name}`
            }

            if (loginAs.innerText.includes('undefined')){
                loginAs.innerText = "Jūs neprisijungęs vartotojas"
                signOut.innerText = "login"
                notification.style.display = 'none'
                allUser.style.display = 'none'
            } else {
                notification.style.display = 'block'
                signOut.innerText = "Sign Out"
                allUser.style.display = 'block'
                allUser.innerHTML = ""
                data.allUser.map(item => {
                    allUser.innerHTML += `
                <div class="regUserName" onclick="showAnotherUserBook(event)">${item.name}</div>
                `
                })
            }
            bookList.innerHTML = ''
            data.book.map(item => {
                let show = loginAs.innerText === "Jūs neprisijungęs vartotojas" ? 'none' : 'block'
                bookList.innerHTML += `
                <div id="${item._id}" class="bookCard">
                <div id="bookImg" style="background-image: url('${item.book}')"></div>
                <div id="reserveBtn" style="display: ${show}" onclick="reserveBook(event)">Reserve Book</div>
            </div>
                `
            })
        })
}
function reserveBook(e){
    console.log(e)
    let img = e.path[1].children[0].attributes[1].value
    img = img.replace('background-image: url(\'','').replace("')","")
    let reserveBook = {
        userId: userId,
        bookId: e.path[1].id,
        bookImg: img
    }
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reserveBook)
    }

    fetch("http://localhost:3000/reserveBook", options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
    setTimeout(showAvailableBook, 200)
    getLoginData(e)





}
function showAnotherUserBook(e){
    console.log(e)
    modal.style.display = "block"
    anotherUserName.innerText = `${e.path[0].innerText} rezervavo šias knygas:`
    fetch(`http://localhost:3000/checkReservedBook/${e.path[0].innerText}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            anotherUserBooks.innerHTML = ''
            data.user[0].inventory.map(item => {
                anotherUserBooks.innerHTML += `
                <div style="display: flex; flex-direction: column; align-items: center">
                <div class="modalBooks" style="background-image: url('${item}')"></div>
                <div id="reserve" onclick="interested(event)">Interested?</div>
                </div>
                `
            })
        })
}
function interested(e){
    console.log(e)

    let usName = e.path[3].children[1].innerText
    usName = usName.replace(" rezervavo šias knygas:", '')

    let msgBookNeeded = {
        userName: usName,
        msgToUser: `${name} interested your book`
    }

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(msgBookNeeded)
    }

    fetch("http://localhost:3000/msg", options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
    e.path[0].innerText = 'user inform'
}
function giveBack(e){
    getLoginData(e)
    console.log(e)
    let image = e.path[1].children[0].attributes[1].value
    image = image.replace('background-image: url(\'','').replace("')","")
    let img = {
        bookImg: image,
        userId: userId
    }
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(img)
    }

    fetch("http://localhost:3000/giveBack", options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })

    setTimeout(findUser,300)

    setTimeout(showAvailableBook, 300)

}
function findUser(e){
    getLoginData(e)
    let user = {
        userId: userId
    }
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }

    fetch("http://localhost:3000/findUser", options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
}

showAvailableBook()



