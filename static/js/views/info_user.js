import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Общая таблица абонентов");
    }

    async getHtml() {
        return `
        <h1>Общая таблица абонентов</h1>
        <div class="sort-menu">
            <label for="sortBy">Сортировать по:</label>
            <select id="sortBy">
                <option value="name">Имени</option>
                <option value="surname">Фамилии</option>
                <option value="email">Электронной почте</option>
                <option value="phone">Мобильному телефону</option>
                <option value="address">Адресу</option>
                <option value="category">Группе</option>
            </select>
            <select id="sortOrder">
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
            </select>
            <button id="sortButton">Сортировать</button>
        </div>
        <table class="abonents-table">
            <thead>
                <tr>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Электронная почта</th>
                    <th>Мобильный телефон</th>
                    <th>Адрес</th>
                    <th>Группа</th>
                </tr>
            </thead>
            <tbody id="abonentsTableBody"></tbody>
        </table>
        `;
    }

    async executeViewScript() {
        const sortButton = document.getElementById('sortButton');

        sortButton.addEventListener('click', () => {
            const sortBy = document.getElementById('sortBy').value;
            const sortOrder = document.getElementById('sortOrder').value;
            this.renderAbonentsTable(sortBy, sortOrder);
        });

        this.renderAbonentsTable();
    }

    renderAbonentsTable(sortBy = 'name', sortOrder = 'asc') {
        const abonentsTableBody = document.getElementById('abonentsTableBody');
        abonentsTableBody.innerHTML = '';

        const abonents = [];
        for (let i = 0; i < localStorage.length; i++) {
            const name = localStorage.key(i);
            const data = localStorage.getItem(name);

            try {
                const abonent = JSON.parse(data);
                if (abonent.role !== "суперадмин" && abonent.role !== "администратор") {
                    const abonentWithDash = { ...abonent };
                    for (const key in abonentWithDash) {
                        if (abonentWithDash[key] === undefined) {
                            abonentWithDash[key] = '-';
                        }
                    }
                    abonents.push({ name, ...abonentWithDash });
                }
            } catch (error) {
                console.error("Ошибка при парсинге JSON:", error);
            }
        }

        abonents.sort((a, b) => {
            const aValue = a[sortBy] || '';
            const bValue = b[sortBy] || '';
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        abonents.forEach(abonent => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${abonent.name || '-'}</td>
                <td>${abonent.surname || '-'}</td>
                <td>${abonent.email || '-'}</td>
                <td>${abonent.phone || '-'}</td>
                <td>${abonent.address || '-'}</td>
                <td>${abonent.category || '-'}</td>
            `;
            abonentsTableBody.appendChild(row);
        });
    }
}
