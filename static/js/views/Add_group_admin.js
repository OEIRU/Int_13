import AbstractView from "./AbstractView.js";
export default class extends AbstractView{
    constructor(){
        super();
        this.setTitle("Добавить админа группы");
    }

    async getHtml(){
        return `<link rel="stylesheet" href="../../css/signupform.css">
        <!--Просто сразу форма без кнопок-->
        <h1>Внимание! Для работы необходим уровень администратора.</h1>
        <p align="center">Пройдите верификацию, заполнив информационные поля ниже.</p>
        <form id="register" class="modal-content">
        <div>
        <label for="name">Имя</label>
        <input id="name" name="name" type="text" placeholder="Введите имя" autocomplete="on" required>
          </div>
          <div>
        <label for="password">Пароль</label>
        <input id="password" name="password" type="text" placeholder="Введите пароль" autocomplete="on" required>
          </div>
          <button id="but" class="button button1" type="submit">Отправить данные</button></form><div align="center" id="ist"></div>
          <div id="ist"></div>
          <h1>Добавьте администратора.</h1>
          <form id="proceed" class="modal-content">
          <div>
          <label for="name">Имя</label>
          <input id="name" name="name" type="text" placeholder="Введите имя" autocomplete="on" required>
            </div>
            <div>
          <label for="password">Пароль</label>
          <input id="password" name="password" type="text" placeholder="Введите пароль" autocomplete="on" required>
            </div>
            
          <button id="control" class="button button1" type="submit">Отправить данные</button>
          </form>
        <div id="est"></div>
        
        `;
    }
    async executeViewScript(){
      document.getElementById("control").disabled = true;
      const form1 = document.querySelector("#register");
      form1.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form1);
        var obj = Object.fromEntries(fd);
        console.log(obj)

            var abonent = JSON.parse(localStorage.getItem(obj.name));
            console.log(abonent);
          if (abonent && abonent.password == "Mega_Admin" && obj.password == "Mega_Admin") {
                document.getElementById('ist').innerHTML= "Верный пароль.";
                document.getElementById("control").disabled = false;
            }
            else{document.getElementById('ist').innerHTML= "Неверный пароль.";
       }

    })
        const form = document.querySelector("#proceed");
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            const obj = Object.fromEntries(fd);

            // Получаем данные абонента из localStorage
            const storedData = localStorage.getItem(obj.name);

            // Проверяем наличие данных и выводим сообщение в консоль
            if (storedData) {
                try {
                    const storedObject = JSON.parse(storedData);

                    // Добавляем обработку данных
                    if (storedObject.password === "Mega_Admin") {
                        document.getElementById('ist').innerHTML = "Такой абонент уже существует. Нажмите кнопку ввода ещё раз для изменения данных этого абонента.";
                        document.getElementById('but').innerHTML = "Изменить.";
                    } else {
                        if (storedObject.password === "no") {
                            storedObject.password = obj.password;
                            if (storedObject.groups == undefined) storedObject.groups = "Администраторы";
                            else storedObject.groups += ", Администраторы";
                            const json = JSON.stringify(storedObject);
                            localStorage.setItem(storedObject.name, json);
                            document.getElementById('est').innerHTML = "Успешно.";
                        } else {
                            document.getElementById('est').innerHTML = "Этот абонент уже администратор группы.";
                        }
                    }

                } catch (error) {
                    console.error("Ошибка при парсинге JSON:", error);
                }
            } else {
                document.getElementById('est').innerHTML = "Такого пользователя нет.";
            }
        });

  }

}