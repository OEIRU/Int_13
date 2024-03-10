import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Добавить абонента");
    }

    // Метод для получения HTML-разметки страницы
    async getHtml() {
        return `
        <link rel="stylesheet" href="/../static/css/signupform.css">
        <!--Просто сразу форма без кнопок-->
        <h1>Внимание! Добавлять новых абонентов может только администратор.</h1>
        <p align="center">Пройдите верификацию, заполнив информационные поля ниже.</p>
        <form id="register" class="modal-content">
            <div>
                <label for="name">Имя</label>
                <input id="name" name="name" type="text" placeholder="Введите имя" autocomplete="on" required>
            </div>
            <div>
                <label for="password">Пароль</label>
                <input id="password" name="password" type="text" placeholder="Введите пароль" autocomplete="on" required>
            </div>
            <button id="but" class="button button1" type="submit">Отправить данные</button>
        </form>
        <div align="center" id="ist"></div>
        <h1>Создайте запись для нового абонента!</h1>
        <form id="proceed" class="modal-content">
            <div>
                <label for="name">Имя</label>
                <input id="name" name="name" type="text" placeholder="Введите имя" autocomplete="on" required>
            </div>
            <div>
                <label for="mail">Электронная почта</label>
                <input id="mail" name="mail" type="text" placeholder="Введите почту" autocomplete="on" required>
            </div>
            <div>
                <label for="phone">Мобильный телефон</label>
                <input id="phone" name="phone" type="text" placeholder="Введите номер" autocomplete="on" required>
            </div>
            <button id="control" class="button button1" type="submit">Добавить абонента.</button>
        </form>
        <div align="center" id="est">Если хотите изменить уже существующего абонента, введите его имя и новые данные.</div>
        `;
    }

    // Метод для выполнения скрипта на странице
    async executeViewScript() {
        // Отключаем кнопку control по умолчанию
        document.getElementById("control").disabled = true;

        // Обработчик события для формы регистрации
        const form1 = document.querySelector("#register");
        form1.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(form1);
            const obj = Object.fromEntries(fd);
            console.log(obj);

            // Получаем данные абонента из localStorage
            const abonent = JSON.parse(localStorage.getItem(obj.name));

            // Проверяем пароль и активируем кнопку control при совпадении
            if (abonent && abonent.password === obj.password) {
                document.getElementById('ist').innerHTML = "Верный пароль.";
                document.getElementById("control").disabled = false;
            } else {
                document.getElementById('ist').innerHTML = "Неверный пароль.";
            }
        });

        // Обработчик события для формы добавления абонента
        const form = document.querySelector("#proceed");
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            fd.append("password", "no");
            const obj = Object.fromEntries(fd);

            // Получаем данные абонента из localStorage
            const storedData = localStorage.getItem(obj.name);

            // Проверяем наличие данных и выводим сообщение в консоль
            if (storedData) {
                try {
                    const storedObject = JSON.parse(storedData);

                    // Добавляем обработку данных
                    if (storedObject.password === "Mega_Admin") {
                        document.getElementById('est').innerHTML = "Такой абонент уже существует. Нажмите кнопку ввода ещё раз для изменения данных этого абонента.";
                        document.getElementById('but').innerHTML = "Изменить.";
                    } else {
                        if (obj.phone.length == 11 || obj.phone.length == 12 && obj.phone[0] == "+") {
                            storedObject.mail = obj.mail;
                            storedObject.phone = obj.phone;
                            const json = JSON.stringify(storedObject);
                            localStorage.setItem(obj.name, json);
                            document.getElementById('est').innerHTML = "Успешно.";
                        } else {
                            document.getElementById('est').innerHTML = "Неверная длина номера. Для изменения данных введите верный номер.";
                        }
                    }

                } catch (error) {
                    console.error("Ошибка при парсинге JSON:", error);
                }
            } else {
                if (obj.phone.length == 11 || obj.phone.length == 12 && obj.phone[0] == "+") {
                    const json = JSON.stringify(obj);
                    localStorage.setItem(obj.name, json);
                    document.getElementById('est').innerHTML = "Успешно.";
                } else {
                    document.getElementById('est').innerHTML = "Неверный формат номера.";
                }
            }
        });
    }
}
