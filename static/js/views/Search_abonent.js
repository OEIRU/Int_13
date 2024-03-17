import AbstractView from "./AbstractView.js";
export default class extends AbstractView{
    constructor(){
        super();
        this.setTitle("Поиск");
    }

    async getHtml(){
        return `
        
        <link rel="stylesheet" href="../../css/signupform.css">
        
        <h1>Осуществляйте поиск других абонентов!</h1>
        <form action="" class="search-bar">
        <input type="text" name="search" required>
        <button class="search-btn" type="submit">
          <span>Search</span>
        </button>
      </form>
      <br>
      <div align="center" id="name"></div>
      <br>
      <div align="center" id="mail"></div>
      <br>
      <div align="center" id="phone"></div>
      <br>
      <div align="center" id="category"></div>
        `;
    }

    async executeViewScript(){ 
        const form = document.querySelector('form')
        form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        var obj = Object.fromEntries(fd);
        
        if (localStorage.getItem(obj.search) == null){
            document.getElementById('name').innerHTML= "Абонент не найден.";
            document.getElementById('mail').innerHTML= "";
            document.getElementById('phone').innerHTML= "";
            document.getElementById('groups').innerHTML= "";
        }
        else{
            var subscriber = JSON.parse(localStorage.getItem(obj.search));
            document.getElementById('name').innerHTML= "Имя: " + subscriber.name;
            document.getElementById('mail').innerHTML= "Электронная почта: " + subscriber.mail;
            document.getElementById('phone').innerHTML= "Телефон: " + subscriber.phone;
            if (subscriber.category == undefined)document.getElementById('category').innerHTML= "Группы: " + "не состоит";
            else document.getElementById('category').innerHTML= "Группы: " + subscriber.category;
      }
        })
  
      }
}
