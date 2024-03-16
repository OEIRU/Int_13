// Импорт всех представлений
import Administration from "./views/Administration.js";
import Add_abonent from "./views/Add_abonent.js";
import Add_group from "./views/Add_group.js";
import Search_abonent from "./views/Search_abonent.js";
import Add_group_admin from "./views/Add_group_admin.js";
import info_user from "./views/info_user.js";
import admin_panel from "./views/mega_admin_panel.js";

// Определение маршрутов
const routes = [
    { path: "/", view: Administration },
    { path: "/add_abonent", view: Add_abonent },
    { path: "/add_group", view: Add_group },
    { path: "/search_abonent", view: Search_abonent },
    { path: "/add_group_admin", view: Add_group_admin },
    { path: "/info_user", view: info_user },
    { path: "/admin_panel", view: admin_panel}
];

// Кэширование элемента DOM для рендеринга представлений
const appElement = document.querySelector("#app");

// Функция для навигации по маршрутам
const navigateTo = async url => {
    history.pushState(null, null, url);
    await router();
};

// Функция для рендеринга представления в зависимости от текущего маршрута
const renderView = async (view) => {
    appElement.innerHTML = await view.getHtml();
    await view.executeViewScript();
};

// Функция для поиска соответствующего маршрута и рендеринга его представления
const router = async () => {
    try {
        const currentPath = location.pathname;
        const matchedRoute = routes.find(route => route.path === currentPath) || routes[0];
        const viewInstance = new matchedRoute.view();
        await renderView(viewInstance);
    } catch (error) {
        console.error("Ошибка в маршрутизации:", error);
    }
};

// Обработчик события popstate для обновления маршрута при нажатии на кнопки навигации браузера
window.addEventListener("popstate", router);

// Обработчик события при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
    // Обработчик события клика на ссылки с атрибутом data-link
    document.body.addEventListener("click", async e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            await navigateTo(e.target.href);
        }
    });

    // Функция для проверки наличия администратора в localStorage
    const checkAdminExists = () => {
        const adminData = localStorage.getItem("Mega_Admin");
        if (!adminData) {
            // Если администратор отсутствует, добавляем его в localStorage
            const superadmin = {
                name: "Mega_Admin",
                password: "Mega_Admin",
                role: "суперадмин"

            };
            localStorage.setItem("Mega_Admin", JSON.stringify(admin));
        }
    };

    // Вызываем функцию проверки администратора при загрузке страницы
    checkAdminExists();
    await router();
});

