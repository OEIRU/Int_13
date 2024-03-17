import AbstractView from "./AbstractView.js";

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
                <input type="password" id="adminPassword" name="adminPassword" required><br>    
                <button id="addSubscriberBtn" type="submit">Войти</button>
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

        const adminLoginForm = document.getElementById("adminLoginForm");

        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const adminName = document.getElementById("adminName").value;
            const adminPassword = document.getElementById("adminPassword").value;

            const adminData = JSON.parse(localStorage.getItem("Mega_Admin")) || {};

            if (adminData.name === adminName && adminData.password === adminPassword) {
                // Проверяем роль пользователя и перенаправляем на соответствующую панель
                if (adminData.role === "суперадмин") {
                    // Переходим на mega_admin_panel
                    window.location.href = "/mega_admin_panel";
                } else if (adminData.role === "администратор") {
                    // Переходим на admin_panel
                    window.location.href = "/admin_panel";
                }
            } else {
                alert("Неверные имя пользователя или пароль администратора!");
            }
        });
        localStorage.removeItem("adminLoggedIn");
    }
}


