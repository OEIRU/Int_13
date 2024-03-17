const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: { // Добавляем поле "фамилия"
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    category: { // Добавляем поле "категория"
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");

fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(data => {
        data.forEach(user => {
            const card = userCardTemplate.content.cloneNode(true).children[0];
            const header = card.querySelector("[data-header]");
            const body = card.querySelector("[data-body]");
            const role = card.querySelector("[data-role]");
            const address = card.querySelector("[data-address]");
            const surname = card.querySelector("[data-surname]"); // Получаем элемент для фамилии
            const category = card.querySelector("[data-category]"); // Получаем элемент для категории
            header.textContent = user.name;
            surname.textContent = user.surname; // Устанавливаем фамилию
            body.textContent = user.email;
            role.textContent = user.role;
            address.textContent = user.address;
            category.textContent = user.category; // Устанавливаем категорию
            userCardContainer.append(card);
        });
    });