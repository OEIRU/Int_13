import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Общая таблица абонентов");
    }

    async getHtml() {
        return `
            <h1>Общая таблица абонентов</h1>
  
            <table class="abonents-table">
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
            <button id="sortButton">Сортировать</button> <br>
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
        const addSubscriberBtn = document.getElementById('addSubscriberBtn');
        const subscriberForm = document.getElementById('subscriberForm');
        const editSubscriberForm = document.getElementById('editSubscriberForm');
        const sortButton = document.getElementById('sortButton');
        sortButton.addEventListener('click', () => {
            const sortBy = document.getElementById('sortBy').value;
            const sortOrder = document.getElementById('sortOrder').value;

            // Get abonents' data from localStorage
            const abonents = [];
            for (let i = 0; i < localStorage.length; i++) {
                const name = localStorage.key(i);
                const data = localStorage.getItem(name);
                try {
                    const abonent = JSON.parse(data);
                    abonents.push({ name, ...abonent });
                } catch (error) {
                    console.error("Ошибка при парсинге JSON:", error);
                }
            }

            // Sort the abonents array based on the selected criteria
            abonents.sort((a, b) => {
                const aValue = a[sortBy] || '';
                const bValue = b[sortBy] || '';
                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });

            // Render the sorted abonents in the table
            const abonentsTableBody = document.getElementById('abonentsTableBody');
            abonentsTableBody.innerHTML = '';
            abonents.forEach(abonent => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${abonent.name}</td>
                <td>${abonent.surname}</td>
                <td>${abonent.mail}</td>
                <td>${abonent.phone}</td>
                <td>${abonent.address}</td>
                <td>${abonent.category}</td>
                <td>${abonent.role}</td>
                <td><button class="editBtn" data-name="${abonent.name}">Редактировать</button></td>
                <td><button class="deleteBtn" data-name="${abonent.name}">Удалить</button></td>
            `;
                abonentsTableBody.appendChild(row);
            });
        });

        this.renderAbonentsTable();
    }

    renderAbonentsTable() {
        const abonentsTableBody = document.getElementById('abonentsTableBody');
        abonentsTableBody.innerHTML = '';

        for (let i = 0; i < localStorage.length; i++) {
            const name = localStorage.key(i);
            const data = localStorage.getItem(name);

            try {
                const abonent = JSON.parse(data);
                const mail = abonent.mail || "-";
                const category = abonent.category || "-";
                const phone = abonent.phone || "-";
                const address = abonent.address || "-";
                const role = abonent.role || "-";
                const surname = abonent.surname || "-";

                // Исключаем суперадмина из таблицы
                if (role !== "суперадмин") {
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
                }
            } catch (error) {
                console.error("Ошибка при парсинге JSON:", error);
                // Если возникает ошибка парсинга JSON, пропускаем текущий элемент и продолжаем цикл

            }
        }



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

                    subscriberForm.style.display = 'none'; // Скрыть форму добавления нового абонента
                } else {
                    alert('Ошибка: Абонент не найден в localStorage.');
                }
            });
            abonents.sort((a, b) => {
                const aValue = a[sortBy] || '', bValue = b[sortBy] || '';
                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
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
            }
            this.renderAbonentsTable();

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
