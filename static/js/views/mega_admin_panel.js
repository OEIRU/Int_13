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
                <option value="role">Роли</option>
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
                    <th>Роль</th>
                    <th>Редактировать</th>
                    <th>Удалить</th>
                </tr>
            </thead>
            <tbody id="abonentsTableBody"></tbody>
        </table>
        <button id="addSubscriberBtn" class="button button1">Добавить нового абонента</button>
        <form id="subscriberForm" style="display: none;">
            <input type="text" id="name" placeholder="Имя" required>
            <input type="text" id="surname" placeholder="Фамилия">
            <input type="email" id="email" placeholder="Электронная почта">
            <input type="tel" id="phone" placeholder="Мобильный телефон" pattern="[0-9]{11}" oninput="this.value = this.value.replace(/\\D/g, '').substring(0, 11);" onfocus="if(this.value==='') this.value = '+7';">
            <input type="text" id="address" placeholder="Адрес">
            <input type="text" id="category" placeholder="Категория">
            <select id="role">
                <option value="" disabled selected>Выберите роль</option>
                <option value="пользователь">Пользователь</option>
                <option value="администратор">Администратор</option>
            </select>
            <input type="text" id="login" placeholder="Логин">
            <input type="password" id="password" placeholder="Пароль">
            <button type="submit">Сохранить</button>
        </form>
            <form id="editSubscriberForm" style="display: none;">
                <input type="text" id="editName" placeholder="Имя" required disabled>
                <input type="email" id="editEmail" placeholder="Электронная почта">
                <input type="tel" id="editPhone" placeholder="Мобильный телефон" pattern="[0-9]{11}" oninput="this.value = this.value.replace(/\\D/g, '').substring(0, 11);" onfocus="if(this.value==='') this.value = '+7';">
                <input type="text" id="editAddress" placeholder="Адрес">
                <select id="editRole">
                    <option value="" disabled selected>Выберите роль</option>
                    <option value="пользователь">Пользователь</option>
                    <option value="администратор">Администратор</option>
                </select>
                <input type="password" id="password" placeholder="Пароль">

                <button type="submit">Сохранить</button>
            </form>
        `;
    }

    async executeViewScript() {
        const sortButton = document.getElementById('sortButton');
        const addSubscriberBtn = document.getElementById('addSubscriberBtn');
        const subscriberForm = document.getElementById('subscriberForm');
        const editSubscriberForm = document.getElementById('editSubscriberForm');

        addSubscriberBtn.addEventListener('click', () => {
            subscriberForm.style.display = 'block';
            editSubscriberForm.style.display = 'none';
        });

        subscriberForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const surname = document.getElementById('surname').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const category = document.getElementById('category').value;
            const role = document.getElementById('role').value;
            const address = document.getElementById('address').value;
            const login = document.getElementById('login').value; // Получаем логин из поля ввода
            const password = document.getElementById('password').value; // Получаем пароль из поля ввода
            const abonent = { mail: email || "", phone: phone || "", address: address || "", role: role || "", category: category || "", surname: surname || "", login: login || "", password: password || "" };

            // Добавляем абонента в Local Storage
            localStorage.setItem(name, JSON.stringify(abonent));

            // Добавляем администратора в Local Storage, если его роль - администратор
            if (role === "администратор") {
                localStorage.setItem(login, JSON.stringify({ name: name, password: password, role: role }));
            }

            subscriberForm.reset();
            subscriberForm.style.display = 'none';
            this.renderAbonentsTable();
        });

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

        // Получаем все абоненты из localStorage
        const abonents = [];
        for (let i = 0; i < localStorage.length; i++) {
            const name = localStorage.key(i);
            const data = localStorage.getItem(name);

            try {
                const abonent = JSON.parse(data);
                // Исключаем абонентов с ролью "суперадмин" из отображаемой таблицы
                if (abonent.role !== "суперадмин") {
                    // Заменяем значения undefined на прочерк
                    const abonentWithDash = { ...abonent };
                    for (const key in abonentWithDash) {
                        if (abonentWithDash[key] === undefined) {
                            abonentWithDash[key] = '-';
                        }
                    }
                    // Добавляем абонента в массив
                    abonents.push({ name, ...abonentWithDash });
                }
            } catch (error) {
                console.error("Ошибка при парсинге JSON:", error);
            }
        }

        // Сортируем абонентов в соответствии с выбранным атрибутом и направлением сортировки
        abonents.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        // Отображаем отсортированных абонентов в таблице
        abonents.forEach(abonent => {
            const { name, surname, mail, phone, address, category, role } = abonent;
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${name}</td>
            <td>${surname}</td>
            <td>${mail}</td>
            <td>${phone}</td>
            <td>${address}</td>
            <td>${category}</td>
            <td>${role}</td>
            <td><button class="editBtn" data-name="${name}">Редактировать</button></td>
            <td><button class="deleteBtn" data-name="${name}">Удалить</button></td>
        `;
            abonentsTableBody.appendChild(row);
        });






        const editButtons = document.querySelectorAll('.editBtn');
        editButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const abonentData = localStorage.getItem(name);
                if (abonentData) {
                    const abonent = JSON.parse(abonentData);
                    const editNameInput = document.getElementById('editName');
                    const editEmailInput = document.getElementById('editEmail');
                    const editPhoneInput = document.getElementById('editPhone');
                    const editAddressInput = document.getElementById('editAddress');
                    const editRoleSelect = document.getElementById('editRole');

                    editNameInput.value = name;
                    editEmailInput.value = abonent.mail || '';
                    editPhoneInput.value = abonent.phone || '';
                    editAddressInput.value = abonent.address || '';
                    editRoleSelect.value = abonent.role || '';

                    const editSubscriberForm = document.getElementById('editSubscriberForm');
                    editSubscriberForm.style.display = 'block';
                } else {
                    alert('Ошибка: Абонент не найден в localStorage.');
                }
            });
        });

// Добавляем обработчик события submit только один раз за пределы цикла forEach
        const editSubscriberForm = document.getElementById('editSubscriberForm');
        editSubscriberForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const editNameInput = document.getElementById('editName');
            const name = editNameInput.value;
            const abonentData = localStorage.getItem(name);
            if (abonentData) {
                const editEmailInput = document.getElementById('editEmail');
                const editPhoneInput = document.getElementById('editPhone');
                const editAddressInput = document.getElementById('editAddress');
                const editRoleSelect = document.getElementById('editRole');

                const newEmail = editEmailInput.value;
                const newPhone = editPhoneInput.value;
                const newAddress = editAddressInput.value;
                const newRole = editRoleSelect.value;

                const updatedAbonent = { mail: newEmail, phone: newPhone, address: newAddress, role: newRole };
                localStorage.setItem(name, JSON.stringify(updatedAbonent));

                // Удаляем старый элемент только если имя было изменено
                const originalName = editNameInput.dataset.originalName;
                if (originalName !== name) {
                    localStorage.removeItem(originalName);
                }

                editSubscriberForm.reset();
                editSubscriberForm.style.display = 'none';
                this.renderAbonentsTable();
            } else {
            }
        });

        const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const confirmation = confirm(`Вы уверены, что хотите удалить абонента "${name}"?`);
                if (confirmation) {
                    localStorage.removeItem(name);
                    this.renderAbonentsTable();
                }
            });
        });
    }
}
