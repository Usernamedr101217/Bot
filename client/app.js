import user from './assets/user.svg'
import bot from './assets/bot.svg'

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat-container');
const openText = document.querySelector('.open-text')

chatContainer.scrollIntoView();

chatContainer.scrollIntoView({behavior: "smooth"});


function generateId() {
    const randomThing = Math.random().toString(16).slice(2);

    console.log(`id-${randomThing}`)
    return `id-${randomThing}`
}

let dotInterval;

function loading(placeholder) {
    placeholder.textContent = '(Thinking)'

    dotInterval = setInterval(() => {
        placeholder.textContent += '.';

        if (placeholder.textContent === '(Thinking).......') {
            placeholder.textContent = ''
        }
    }, 1000)
}

function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
      if (index < text.length) {
          element.innerHTML += text.charAt(index)
          index++
      } else {
          clearInterval(interval)
      }
  }, 10)
}

function chatBubble(isAi, value, id) {
    return (
        `
          <section class="wrapper ${isAi ? "bot" :  "user"}">
            <div class="chat-holder">
              <div class="avatar">
                <img
                  src=${isAi ? bot : user}
                  alt=${isAi ? 'bot' : 'user'}
                />
              </div>

              <p class="message" id=${id}>${value}</p>
            </div>
          </section>
        `
    )
}

function hideText() {
  openText.classList.add('hidden');
}

async function handleSubmit(e) {
    e.preventDefault();
    hideText()

    const formData = new FormData(form);

    chatContainer.innerHTML += chatBubble(false, formData.get('prompt'));
    form.reset();

    const id = generateId();
    chatContainer.innerHTML += chatBubble(true, "", id);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const message = document.getElementById(id);
    loading(message);  

    const response = await fetch('http://localhost:5000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: formData.get('prompt')
      })
    })

    clearInterval(dotInterval);
    message.innerHTML = " ";

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();
      console.log(data)

      typeText(message, parsedData);
    } else {
      message.innerHTML = "Something wrong"
    }
}

function formHover() {
  form.style.opacity = 1;
}
function notTyping() {
  form.style.opacity = 0.2;
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})

form.addEventListener('focusin', () => {
  formHover()
})
form.addEventListener('focusout', () => {
  notTyping()
})