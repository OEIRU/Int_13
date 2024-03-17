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
                    <th>Категория</th> 
                    <th>Адрес</th> 
                </tr>`;


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
                            <label for="category">Категория</label>
                            <input id="category" name="category" type="text" value="${abonent.category}" autocomplete="on" required>
                            <label for="address">Адрес</label>
                            <input id="address" name="address" type="text" value="${abonent.address}" autocomplete="on" required>
                            <button type="submit">Сохранить изменения</button>
                        </form>`;
                    document.getElementById("view").innerHTML = editFormHtml;
        };
    }
}
