import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Общая таблица абонентов");
    }

    // Метод для получения HTML-разметки страницы
    async getHtml() {
        // Получаем все записи из localStorage
        const allEntries = Object.entries(localStorage);

        // Формируем HTML-разметку для таблицы
        let tableHtml = `
        <h1>Общая таблица абонентов</h1>
        <table class="abonents-table">
            <thead>
                <tr>
                    <th>Имя</th>
                    <th>Электронная почта</th>
                    <th>Мобильный телефон</th>
                    <th>Адрес</th>
                </tr>
            </thead>
            <tbody>`;

        // Добавляем строки таблицы для каждого абонента
        allEntries.forEach(entry => {
            const [name, data] = entry;
            try {
                const abonent = JSON.parse(data);

                // Проверяем роль абонента
                if (abonent.role !== "администратор" && abonent.role !== "суперадмин") {
                    const mail = abonent.mail ? abonent.mail : "-";
                    const phone = abonent.phone ? abonent.phone : "-";
                    const address = abonent.address ? abonent.address : "-";
                    tableHtml += `
                    <tr>
                        <td>${name}</td>
                        <td>${mail}</td>
                        <td>${phone}</td>
                        <td>${address}</td>
                    </tr>`;
                }
            } catch (error) {
                console.error("Ошибка при парсинге JSON:", error);
            }
        });

        // Закрываем таблицу
        tableHtml += `
            </tbody>
        </table>`;

        return tableHtml;
    }
}
