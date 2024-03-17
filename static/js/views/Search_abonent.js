import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Поиск");
    }

    async getHtml() {
        return `
            <link rel="stylesheet" href="../../css/signupform.css">
            <link rel="stylesheet" href="../../css/search.css">
            
            <h1>Осуществляйте поиск других абонентов!</h1>
            <form class="search-bar">
                <input type="text" name="search" required>
                <button class="search-btn" type="submit"></button>
            </form>
            <br>
            <div align="center" id="userDetails"></div>
        `;
    }

    async executeViewScript() {
        const form = document.querySelector('.search-bar');
        const searchBtn = form.querySelector('.search-btn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchQuery = form.search.value.toLowerCase();
            const foundSubscriber = this.findSubscriber(searchQuery);
            this.displaySubscriberDetails(foundSubscriber);

            // Скрыть надпись на кнопке после нажатия
            searchBtn.textContent = "";
            searchBtn.style.width = "0";
            searchBtn.style.padding = "0";
        });
    }

    findSubscriber(searchQuery) {
        // Проходимся по всем ключам в LocalStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // Проверяем, совпадает ли ключ с искомой строкой (именем абонента)
            if (key.toLowerCase() === searchQuery) {
                // Получаем значение по ключу
                const storedItem = localStorage.getItem(key);

                // Проверяем, есть ли значение
                if (storedItem) {
                    // Если есть, пытаемся распарсить его как JSON
                    try {
                        // Парсим данные
                        const subscriber = JSON.parse(storedItem);
                        // Переопределяем ключ "Мем" как свойство "name"
                        subscriber.name = key;
                        return subscriber;
                    } catch (error) {
                        console.error("Ошибка при парсинге значения из LocalStorage:", error);
                        return null;
                    }
                }
            }
        }
        // Если абонент не найден, возвращаем null
        return null;
    }
    displaySubscriberDetails(subscriber) {
        const userDetailsDiv = document.getElementById('userDetails');
        if (subscriber) {
            // Проверяем наличие имени абонента
            const name = subscriber.name ? subscriber.name : (subscriber.surname ? subscriber.surname : 'отсутствует');

            userDetailsDiv.innerHTML = `
        <div align="center">
            <p>Имя: ${name}</p>
            <p>Фамилия: ${subscriber.surname ? subscriber.surname : 'отсутствует'}</p>
            <p>Электронная почта: ${subscriber.mail ? subscriber.mail : 'отсутствует'}</p>
            <p>Телефон: ${subscriber.phone ? subscriber.phone : 'отсутствует'}</p>
            <p>Группы: ${subscriber.category ? subscriber.category : 'не состоит'}</p>
        </div>
    `;
        } else {
            userDetailsDiv.innerHTML = "<p>Абонент не найден.</p>";
        }
    }
}
