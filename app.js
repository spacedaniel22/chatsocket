(() => {
    const ConfigEnum = {
        SocketServerAddress: "http://185.13.90.140:8081/",
        MessageType: {
            MESSAGE: "message"
        },
        HtmlToInsert: "beforeend",
        KeyCodes: {
            ENTER: 13
        },
        AdditionalClassName: "own"
    }

    const messages$ = document.querySelector(".messages");
    const user$ = document.querySelector(".user");
    const msgInput$ = document.querySelector(".msgInput");
    const send$ = document.querySelector(".send");

    class Server {
        constructor(io, address) {
            this.io = io;
            this.address = address;
            this.socket = this.io.connect(this.address);
        }

        sendMessage({user, message}) {
            this.socket.emit("message", { user, message })
        }
    }

    class Message {
        constructor(data, isOwn) {
            this.user = data.user;
            this.message = data.message;
            this.isOwn = isOwn;
        }

        get template() {
            const userName = this.isOwn ? "" : `${this.user}: `;
            const additionalClass = this.isOwn ? "own" : "";
            return `<div class="message ${additionalClass}">${userName}${this.message}</div>`;
        }

    }

    function handleInsert(template) {
        messages$.insertAdjacentHTML(ConfigEnum.HtmlToInsert, template);
        messages$.scrollTop = messages$.scrollHeight;
    }

    function handleSend() {
        const data = { user: user$.value, message: msgInput$.value }
        server.sendMessage(data);
        const ownMessage = new Message(data, true);
        handleInsert(ownMessage.template);
        msgInput$.value = "";
        return false;
    }

    const server = new Server(io, ConfigEnum.SocketServerAddress);
    const connection = server.socket;
    connection.on(ConfigEnum.MessageType.MESSAGE, (data) => {
        const newMessage = new Message(data, false);
        handleInsert(newMessage.template);
    });

    msgInput$.addEventListener("keydown", (event) => {
        if (event.which === ConfigEnum.KeyCodes.ENTER || event.keyCode === ConfigEnum.KeyCodes.ENTER) {
            handleSend();
        }
    });

    send$.addEventListener("click", () => {
        handleSend();
    });
})();