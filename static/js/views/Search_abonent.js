import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Поиск");
    }

    async getHtml() {
        return `

        <link rel="stylesheet" href="../../css/signupform.css">

        <h1>Осуществляйте поиск других абонентов!</h1>
        <form action="" class="search-bar">
            <input type="text" name="search" required>
            <button class="search-btn" type="submit">
                <span>Search</span>
            </button>
        </form>
        <br>
        <div align="center" id="userCardsContainer" data-user-cards-container></div>
        `;
    }

    async executeViewScript() {
        const form = document.querySelector('form');
        const userCardContainer = document.getElementById('userCardsContainer');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const searchQuery = formData.get('search');

            // Получаем пользователей из LocalStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];

            // Фильтруем пользователей по имени или фамилии
            users = users.filter(user => user.name.includes(searchQuery) || user.surname.includes(searchQuery));

            // Очищаем контейнер перед добавлением новых карточек
            userCardContainer.innerHTML = '';

            users.forEach(user => {
                const card = document.createElement('div');
                card.classList.add('user-card');
                card.innerHTML = `
                <div class="card-header">${user.name} ${user.surname}</div>
                <div class="card-body">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Роль:</strong> ${user.role}</p>
                    <p><strong>Адрес:</strong> ${user.address}</p>
                    <p><strong>Категория:</strong> ${user.category}</p>
                </div>
            `;
                userCardContainer.appendChild(card);
            });
        });
    }

}
