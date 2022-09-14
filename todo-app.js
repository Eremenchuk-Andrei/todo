(function () {
  let taskArray = [];
  let keys;

  //создаем и возвращаем заголовок приложения
  function createAppTittle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }
  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите назавние дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.setAttribute("disabled", "disabled");

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }
  //создаем и возвращем список элементов
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(name) {
    let item = document.createElement("li");
    //кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    //устанавливаем стили для элемента списка, а также для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);


    doneButton.addEventListener("click", function () {
      for (let i = 0; i < taskArray.length; i++) {
        if (taskArray[i].name === name) {
          let index = taskArray.indexOf(taskArray[i]);
          taskArray[index].done = taskArray[i].done ? false : true;
        }
      }
      item.classList.toggle("list-group-item-success");
      localStorage.setItem(keys, JSON.stringify(taskArray));
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        for (let i = 0; i < taskArray.length; i++) {
          if (taskArray[i].name === name) {
            taskArray.splice(i, 1);
            localStorage.setItem(keys, JSON.stringify(taskArray));
          }
        }
      }
      item.remove();
    });

    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать событие нажатия
    return {
      item,
      deleteButton,
      doneButton,
    };
  }
  function createTodoApp(container, title = "Список дел", deafaultTask, key) {
    let todoAppTitle = createAppTittle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    keys = key;

    // disabled при создании дела
    todoItemForm.input.addEventListener("input", function () {
      if (todoItemForm.input.value != "") {
        todoItemForm.button.removeAttribute("disabled");
      } else {
        todoItemForm.button.setAttribute("disabled", "disabled");
      }
    });

    if (localStorage.getItem(keys) === null) {
      localStorage.setItem(keys, JSON.stringify(deafaultTask));
    }

    // if (taskArray) {
    // taskArray = JSON.parse(localStorage.getItem(key));
    // } else {
    //   taskArray = [];
    // }

    taskArray = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];

    //красим в зеленый дефолтные дела если true
    for (let key in taskArray) {
      tasks = createTodoItem(taskArray[key].name);
      todoList.append(tasks.item);

      if (taskArray[key].done === true) {
        tasks.item.classList.toggle("list-group-item-success");
      }
    }

    //браузер создает событие submit на форме по нажатию на enter или на кнопку созднаия дела
    todoItemForm.form.addEventListener("submit", function (e) {
      //disabled для кнопки при отправке дела
      todoItemForm.input.addEventListener("input", function () {
        if (todoItemForm.input.value != "") {
          todoItemForm.button.removeAttribute("disabled");
        } else {
          todoItemForm.button.setAttribute("disabled", "disabled");
        }
      });
      todoItemForm.button.setAttribute("disabled", "disabled");

      //эта строчка необходима, чтобы предотвратить стандартные действия браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      for (let i = 0; i < taskArray.length; i++) {
        let itemTask = todoItemForm.input.value;
        if (taskArray[i].name === itemTask) {
          alert("Такое дело уже существует!");
          return;
        }
      }

      let newTodo = {
        name: todoItemForm.input.value,
        done: false,
      };
      taskArray.push(newTodo);
      localStorage.setItem(key, JSON.stringify(taskArray));

      let todoItem = createTodoItem(todoItemForm.input.value);
      // создаем и добавляем в список нове дело с названием из поля для ввода
      todoList.append(todoItem.item);
      //обнуляем значение в поле, чтобы не пришлось стирать его в ручную
      todoItemForm.input.value = "";
    });
  }
  window.createTodoApp = createTodoApp;
})();
