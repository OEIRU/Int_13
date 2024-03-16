import AbstractView from "./AbstractView.js";
export default class extends AbstractView{
    constructor(){
        super();
        this.setTitle("Главная");
    }

    async getHtml(){
        return `
        <link rel="stylesheet" href="../../css/signupform.css">
        <h1>Добро пожаловать на главную страницу!</h1>
        <p>Вы находитесь в адресной книге компании ООО АвангардТех. Здесь вы можете найти интересующего
        Вас сотрудника с помощью вкладки "Поиск абонентов". К сожалению, такие действия как добавление нового абонента,
        добавление новой категории абонентов или добавление администратора категории недоступны обычным пользователям.
        Необходимо иметь статус администратора адресной книги.</p>
        <h1>Наши лучшие сотрудники:</h1>
        <div class="container">
        <!--Для лучшего чтения кода~Первая картинка-->
        <div class="image-container">
        <img src="https://i.pinimg.com/564x/52/d7/a7/52d7a7b5f7113466b19999dbd6e5cd4f.jpg" >
        <div class="overlay">
        <p class="picture_text">Ирина Николаевна Парникова</p>
        <p class="picture_text">Менеджер по управлению персоналом, инициатор создания адресной книги: "Мой опыт работы в офисной среде позволил мне развить навыки коммуникации, как внутри команды, так и с клиентами или партнерами."</p>
        </div></div>
        <!--Вторая картинка-->
        <div class="image-container">
        <img src="https://i.pinimg.com/236x/0d/b7/72/0db772c78ceb1f96ce82b0fc19eb3b8e.jpg" >
        <div class="overlay">
        <p class="picture_text">Геннадий Константинович Капустин</p>
        <p class="picture_text">Администратор адресной книги:"Моя основная обязанность - поддерживать стабильность
        работы адресной книги, чтобы сотрудники компании могли находить необходимую контактную информацию
        друг друга."</p>
        </div></div>
        <!--Третья картинка-->
        <div class="image-container">
        <img src="https://i.pinimg.com/564x/04/8a/19/048a1908847f8333e7f4ea953b196445.jpg" >
        <div class="overlay">
        <p class="picture_text">Дмитрий Вячеславович Павликов</p>
        <p class="picture_text">Senior Developer:"Приветствую! Я программист, специализирующийся на JavaScript.
        В моей работе я стремлюсь к более чистому и модульному подходу, следую лучшим практикам разработки кода и уделяю внимание оптимизации и 
        производительности приложений."</p>
        </div></div>
        <!--Четвертая картинка-->
        <div class="image-container">
        <img src="https://i.pinimg.com/564x/05/92/38/0592388b3847fa32ef577ef8a6bc1887.jpg" >
        <div class="overlay">
        <p class="picture_text">Роман Васильевич Брумм</p>
        <p class="picture_text">Frontend-разработчик:"Привет! Я - frontend-разработчик. Я постоянно стремлюсь к самосовершенствованию и изучению новых инструментов и технологий, 
        чтобы быть в курсе последних трендов во фронтенд-разработке. Я владею навыками верстки, управления состоянием, маршрутизации и работы с API."</p>
        </div></div>
        <!--Пятая картинка-->
        <div class="image-container">
        <img src="https://i.pinimg.com/236x/2b/28/e6/2b28e6bc0c5580d29332c7aa3cf38a48.jpg">
        <div class="overlay">
        <p class="picture_text">Клавдия Станиславовна Снежко</p>
        <p class="picture_text">"Основатель компании: Я - основатель и вдохновитель нашей IT-компании. Моим главным стремлением является создание инновационной и коллаборативной культуры, где каждый член команды имеет 
        свободу выражать свои идеи и брать на себя ответственность."</p>
        </div></div>
        <!--Конец контейнера class=container-->
        </div>
        <br> <!--И абзац-->
        `
            ;
    }
    async executeViewScript(){
        const form = document.querySelector('form')
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            var obj = Object.fromEntries(fd);
            console.log(obj)

            var abonent = JSON.parse(localStorage.getItem(obj.name));
            console.log(abonent);
            if(abonent.password === "Mega_Admin" && obj.password === "Mega_Admin"){
                document.getElementById('est').innerHTML= "Админ.";
            }
            else{document.getElementById('est').innerHTML= "Не админ.";}

        })
    }
}