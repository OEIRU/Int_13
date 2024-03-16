const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
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
        type: String,
        required: true
    }
    category: {
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
            const category = card.querySelector("[data-category]");
            const surname = card.querySelector("[data-surname]");

            header.textContent = user.name;
            surname.textContent = user.surname; 
            body.textContent = user.email;
            role.textContent = user.role;
            address.textContent = user.address;
            category.textContent = user.category;
            userCardContainer.append(card);
        });
    });