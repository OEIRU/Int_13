const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
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
    address: {
        type: String, // или другой тип данных, который соответствует вашим требованиям
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
            const address = card.querySelector("[data-address]"); // Добавляем поиск элемента для адреса
            header.textContent = user.name;
            body.textContent = user.email;
            role.textContent = user.role;
            address.textContent = user.address; // Устанавливаем адрес
            userCardContainer.append(card);
        });
    });