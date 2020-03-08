const socket = io()

const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormBtn = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message)=> {
    const template = Handlebars.compile(messageTemplate)
    const data = {
        'username': message.username,
        "message": message.text,
        "createdAt": moment(message.createdAt).format("MMM Do YYYY, H:mm")
    }
    const handlebars = template(data)
    $messages.insertAdjacentHTML('beforeend', handlebars)
})

document.querySelector('#messageForm').addEventListener('submit', (e) => {
    e.preventDefault()
    //disable the btn
    $messageFormBtn.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormBtn.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message send')
    })
})