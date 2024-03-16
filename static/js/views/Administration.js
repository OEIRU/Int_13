import AbstractView from "./AbstractView.js";
const infoUserBtn = document.getElementById("infoUserBtn");
const searchAbonentBtn = document.getElementById("searchAbonentBtn");
export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Верификация администратора");
    }

    async getHtml() {
        return `
            <h1>Верификация администратора</h1>
            <form id="adminLoginForm">
                <label for="adminName">Логин:</label>
                <input type="text" id="adminName" name="adminName" required> <br>
                <label for="adminPassword">Пароль:</label>
                <input type="password" id="adminPassword" name="adminPassword" required>
                <button type="submit">Войти</button>
            </form>
            <br>
            <form>
                <button type="button" id="infoUserBtn">Информация о пользователях</button>
                <button type="button" id="searchAbonentBtn">Поиск абонента</button>
            </form>
        `;
    }

    async executeViewScript() {
        // Проверяем, если уже есть данные суперадмина в Local Storage, то не добавляем их заново
        if (!localStorage.getItem("Mega_Admin")) {
            // Заранее задаем данные суперадмина
            const superAdmin = {
                name: "Mega_Admin",
                password: "Mega_Admin",
                role: "суперадмин"
            };

            // Сохраняем данные суперадмина в Local Storage
            localStorage.setItem("Mega_Admin", JSON.stringify(superAdmin));
        }

        // Добавляем код кнопок после формы
        const adminLoginForm = document.getElementById("adminLoginForm");
        adminLoginForm.insertAdjacentHTML('afterend', `
        <form>
            <button type="button" id="infoUserBtn">Информация о пользователях</button>
            <button type="button" id="searchAbonentBtn">Поиск абонента</button>
        </form>
    `);

        // Добавляем обработчики для кнопок перехода
        const infoUserBtn = document.getElementById("infoUserBtn");
        const searchAbonentBtn = document.getElementById("searchAbonentBtn");

        infoUserBtn.addEventListener('click', () => {
            window.location.href = "/info_user";
        });

        searchAbonentBtn.addEventListener('click', () => {
            window.location.href = "/search_abonent";
        });

        localStorage.removeItem("adminLoggedIn");
    }
}