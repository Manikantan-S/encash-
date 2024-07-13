const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input-field");
const msgerChat = get(".msger-chat");
const BOT_IMG = "bot.png";
const PERSON_IMG = "user.png";
const BOT_NAME = "BOT";
const PERSON_NAME = "person";

let LANG = "eng_Latn";

async function loadLanguages() {
    const response = await fetch('http://127.0.0.1:5000/languages');
    const languages = await response.json();

    const tgtLangSelect = document.querySelector("#languages");

    for (const key in languages) {
        const option = document.createElement("option");
        option.value = key;
        option.text = languages[key];
        tgtLangSelect.appendChild(option);
    }
}

loadLanguages();

document.querySelector("#languages").addEventListener("change", function(e) {
    LANG = e.target.value;
});

msgerForm.addEventListener("submit", async event => {
    event.preventDefault();
    const msgText = msgerInput.value;
    if (!msgText) return;
    msgerInput.value = "";
    addChat(PERSON_NAME, PERSON_IMG, "right", msgText);
    await output(msgText);
});

async function output(input) {
    try {
        const response = await fetch('http://127.0.0.1:5000/translated_mistral', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: input,
                src_lang: LANG,
                reference: "",
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);

        if (data.translated_result) {
            addChat(BOT_NAME, BOT_IMG, "left", data.translated_result);
        } else if (data.error) {
            addChat(BOT_NAME, BOT_IMG, "left", `Error: ${data.error}`);
        } else {
            addChat(BOT_NAME, BOT_IMG, "left", "No result");
        }
    } catch (error) {
        console.error('Error:', error);
        addChat(BOT_NAME, BOT_IMG, "left", `Error: ${error.message}`);
    }
}

function addChat(name, img, side, text) {
    const msgHTML = `
        <div class="msg ${side}-msg">
            <div class="msg-img" style="background-image: url(${img})"></div>
            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${name}</div>
                    <div class="msg-info-time">${formatDate(new Date())}</div>
                </div>
                <div class="msg-text">${text}</div>
            </div>
        </div>
    `;
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
}

