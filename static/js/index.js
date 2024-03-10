import Homepage from "./views/Homepage.js";
import Add_abonent from "./views/Add_abonent.js";
import Add_group from "./views/Add_group.js";
import Search_abonent from "./views/Search_abonent.js";
import Add_group_admin from "./views/Add_group_admin.js";

const navigateTo = url =>{
    history.pushState(null, null, url);
    router();
}; // навигация с помощью истории(HISTORY API), с помощью неё осуществляются переходы без перезагрузки страницы


const router = async() => {
    const routes = [
        {path: "/", view: Homepage}, // для каждого пути своя страничка
        {path: "/add_abonent", view: Add_abonent},
        {path: "/add_group", view: Add_group},
        {path: "/search_abonent", view: Search_abonent},
        {path: "/add_group_admin", view: Add_group_admin}

    ];
    // test each route for potential match на данный момент не используется
    // если написать в консоль devtools location.pathname можно увидеть значения true и false
    // true - если вкладка есть в url вкладки, где происходит проверка совпадений, для остальных это false.
    // просто инструмент для траблшутинга
    const potentialMatches = routes.map(route => {
        return{
            route: route,
            isMatch: location.pathname === route.path
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);
    if(!match) {
        match = {
            route: routes[0],
            isMatch: true
        };
    };

    const view = new match.route.view();

    document.querySelector("#app").innerHTML = await view.getHtml();
    await view.executeViewScript(); // FIX


};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e =>{ // e - ивент-объект, ивент работает при клике
        if(e.target.matches("[data-link]")){ // е в данном случае - это выбранная для клика ссылка, если у этой ссылки есть
            // атрибут data-link(а внутри страницы у них он есть), то мы переходим по ней с помощью функции ниже
            e.preventDefault(); // предотвращает традиционный переход на страницу
            navigateTo(e.target.href); // и позволяет использовать эту функцию вместо стандартного поведения перехода
            // со страницы на страницу - через перезагрузку
        }
    } );
    router();
});