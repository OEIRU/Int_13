import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Общая таблица абонентов");
    }

    async getHtml() {
        return `
            <h1>Общая таблица абонентов</h1>

                <table class="abonents-table scrollable-table">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Фамилия</th>
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
                <input type="text" id="editSurname" placeholder="Фамилия">
                <input type="tel" id="editPhone" placeholder="Мобильный телефон" pattern="[0-9]{11}" oninput="this.value = this.value.replace(/\\D/g, '').substring(0, 11);" onfocus="if(this.value==='') this.value = '+7';">
                <input type="text" id="editAddress" placeholder="Адрес">
                <input type="text" id="editCategory" placeholder="Категория">
                <select id="editRole">
                    <option value="" disabled selected>Выберите роль</option>
                    <option value="пользователь">Пользователь</option>
                    <option value="администратор">Администратор</option>
                </select>
                <input type="password" id="password" placeholder="Пароль (для нового администратора)">

                <button type="submit">Сохранить</button>
            </form>

        `;

    }

    async executeViewScript() {
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
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const category = document.getElementById('category').value;
            const role = document.getElementById('role').value;
            const password = document.getElementById('password').value; // Получаем пароль из поля ввода
            const abonent = {
                surname: surname || "",
                phone: phone || "",
                address: address || "",
                category: category || "",
                role: role || "",
            };

            // Если роль "администратор", запросить пароль у пользователя
            if (role === "администратор") {
                const adminPassword = prompt("Введите пароль для учетной записи администратора:");
                if (adminPassword) { // Проверяем, был ли введен пароль
                    // Сохраняем логин и пароль в localStorage
                    localStorage.setItem('name', name);
                    localStorage.setItem('password', adminPassword);
                    localStorage.setItem('role', role);

                    // Обновляем данные абонента в localStorage
                    const abonent = {
                        surname: surname || "",
                        phone: phone || "",
                        address: address || "",
                        category: category || "",
                        role: role || "",
                    };
                    localStorage.setItem(name, JSON.stringify(abonent));

                    // Перерисовываем таблицу абонентов
                    this.renderAbonentsTable();
                }
                return; // Прерываем выполнение функции, чтобы данные не сохранялись
            }

            localStorage.setItem(name, JSON.stringify(abonent));
            subscriberForm.reset(); // Сбросить форму добавления абонента
            subscriberForm.style.display = 'none'; // Скрыть форму добавления абонента
            this.renderAbonentsTable(); // Обновить таблицу абонентов

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
                const surname = abonent.surname || "-";
                const mail = abonent.mail || "-";
                const category = abonent.category || "-";
                const phone = abonent.phone || "-";
                const address = abonent.address || "-";
                const role = abonent.role || "-";

                // Исключаем суперадмина из таблицы
                if (role !== "суперадмин") {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${name}</td>
                <td>${surname}</td>
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
                    const editSurnameInput = document.getElementById('editSurname');
                    const editPhoneInput = document.getElementById('editPhone');
                    const editAddressInput = document.getElementById('editAddress');
                    const editCategoryInput = document.getElementById('editCategory');
                    const editRoleSelect = document.getElementById('editRole');

                    editNameInput.value = name;

                    editSurnameInput.value = abonent.surname || '';

                    editPhoneInput.value = abonent.phone || '';
                    editAddressInput.value = abonent.address || '';
                    editCategoryInput.value = abonent.category || ''; // Значение категории
                    editCategoryInput.dataset.originalCategory = abonent.category || ''; // Добавляем атрибут с оригинальной категорией

                    editRoleSelect.value = abonent.role || '';

                    const editSubscriberForm = document.getElementById('editSubscriberForm');
                    editSubscriberForm.style.display = 'block';

                    subscriberForm.style.display = 'none'; // Скрыть форму добавления нового абонента
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
                const editSurnameInput = document.getElementById('editSurname');
                const editPhoneInput = document.getElementById('editPhone');
                const editAddressInput = document.getElementById('editAddress');
                const editCategoryInput = document.getElementById('editCategory');
                const editRoleSelect = document.getElementById('editRole');

                const newSurname = editSurnameInput.value;
                const newPhone = editPhoneInput.value;
                const newAddress = editAddressInput.value;
                const newCategory = editCategoryInput.value;
                const newRole = editRoleSelect.value;

                const updatedAbonent = {surname: newSurname, phone: newPhone, address: newAddress, category: newCategory, role: newRole};
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
