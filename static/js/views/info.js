import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Управление абонентами");
    }

    // Метод для получения HTML-разметки страницы
    async getHtml() {
        // Получаем все записи из localStorage
        const allEntries = Object.entries(localStorage);

        // Формируем HTML-разметку для таблицы
        let tableHtml = `
            <h1>Управление абонентами</h1>
            <table>
                <tr>
                    <th>Имя</th>
                    <th>Электронная почта</th>
                    <th>Мобильный телефон</th>
                    <th>Действия</th>
                </tr>`;

        // Добавляем строки таблицы для каждого абонента
        allEntries.forEach(entry => {
            const [name, data] = entry;
            try {
                const abonent = JSON.parse(data);
                tableHtml += `
                    <tr>
                        <td>${name}</td>
                        <td>${abonent.mail}</td>
                        <td>${abonent.phone}</td>
                        <td><button onclick="editAbonent('${name}')">Редактировать</button></td>
                    </tr>`;
            } catch (error) {
                console.error("Ошибка при парсинге JSON:", error);
            }
        });

        // Закрываем таблицу
        tableHtml += "</table>";

        return tableHtml;
    }

    // Метод для выполнения скрипта на странице
    async executeViewScript() {
        // Функция для редактирования абонента
        window.editAbonent = (name) => {
            // Получаем данные абонента из localStorage
            const storedData = localStorage.getItem(name);

            // Проверяем наличие данных и открываем форму редактирования
            if (storedData) {
                try {
                    const abonent = JSON.parse(storedData);
                    const editFormHtml = `
                        <h2>Редактирование данных абонента ${name}</h2>
                        <form id="editForm">
                            <label for="mail">Электронная почта</label>
                            <input id="mail" name="mail" type="text" value="${abonent.mail}" autocomplete="on" required>
                            <label for="phone">Мобильный телефон</label>
                            <input id="phone" name="phone" type="text" value="${abonent.phone}" autocomplete="on" required>
                            <button type="submit">Сохранить изменения</button>
                        </form>`;
                    document.getElementById("view").innerHTML = editFormHtml;

                    // Обработчик события для формы редактирования
                    document.getElementById("editForm").addEventListener('submit', (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const updatedAbonent = Object.fromEntries(formData);
                        const json = JSON.stringify(updatedAbonent);
                        localStorage.setItem(name, json);
                        alert("Данные абонента успешно обновлены!");
                        // Перезагрузка страницы для обновления таблицы
                        location.reload();
                    });
                } catch (error) {
                    console.error("Ошибка при парсинге JSON:", error);
                }
            } else {
                alert("Ошибка: абонент не найден!");
            }
        };
    }
}
