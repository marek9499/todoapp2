const Todo = {
    articles: document.querySelector(".tasks"), //lista tasków
    mainParagraphInfo: document.querySelector(".hello__paragraph:last-child"),
    newTaskButton: document.querySelector("section.tasksManagment").querySelector("#addTask"),
    removeSelectedTasksButton: document.querySelector("section.tasksManagment").querySelector("#removeTask"),
    selectedCheckboxes: null, //zaznaczone checkboxy, w momencie ładowania strony żadne nie są
    taskId: 0, //`id` taska, który ma zostać dodany albo zerowany w przypadku usunięcia wszystkich tasków
    isNewTaskTemplateVisible: false, //czy szablon dodawania nowego taska jest widoczny
    newItemColors: ["red", "green", "yellow", "purple"],


    init: function () {
        this.tasks = this.getTaskList();
        this.renderCurrentTasks();
        this.bindButtons();
        this.checkboxObserver();
        this.renderParagraphs();
    },

    getTasksAmount: function () {
        if (this.tasks != null) {
            return this.tasks.length;
        }
        return 0;
    },

    renderParagraphs: function () {
        let paragraphContainer = this.mainParagraphInfo;

        if (this.getTasksAmount() != null && this.getTasksAmount() != 0) {
            paragraphContainer.innerHTML = `Zostały Ci <span class="hello__highlight">${this.getTasksAmount()} zadania</span> do ukończenia`;
        }
        else {
            paragraphContainer.innerText = "Wygląda na to, że nie masz żadnych tasków, może jakiś dodasz?";
        }
    },

    /*
    Podpinamy zdarzenia
    */
    bindButtons: function () {
        this.newTaskButton.addEventListener("click", this.newTaskButton_onClick.bind(this));
        this.removeSelectedTasksButton.addEventListener("click", this.removeSelectedTasksButton_onClick.bind(this));
        this.articles.addEventListener("keyup", this.newTask_onEnter.bind(this));
        this.articles.addEventListener("click", this.task_onClick.bind(this));
    },

    /*
    Dodaje szablon do dodania nowego taska
    */
    addTaskTemplate: function () {
        if (this.tasks != null) {
            if (this.tasks.length != undefined) {
                if ('id' in this.tasks[this.tasks.length - 1]) {
                    this.taskId = this.tasks[this.tasks.length - 1].id + 1;
                }
                else {
                    this.taskId += 1;
                }
            }
        }
        else {
            this.taskId = 0;
        }

        const taskTemplate = `
        <div class="tasks__dot"></div>
        <div clsss="tasks__block">
            <div class="form__control">
                <input class="form__control__input" type="text" placeholder="Wprowadź tekst" id="addTaskInput"
                autofocus>
            </div>
        </div>
        `;

        let li = document.createElement("article");
        li.classList.add("tasks__box");
        li.setAttribute("data-todo-id", this.taskId);
        li.innerHTML = taskTemplate;
        this.articles.appendChild(li)

        this.newTaskButton.disabled = true;
        this.isNewTaskTemplateVisible = true;
        document.querySelector("input[id='addTaskInput']").focus();
    },

    /*
    Dodaje nowego taska
    */
    addTask: function (taskName, taskColor) {
        let myTask = {
            id: this.taskId,
            completed: false,
            info: taskName,
            color: taskColor
        }

        //Jeśli nie ma żadnych tasków to za pierwszym razem dodajemy `myTask` do tablicy, a gdy już będą to przypisujemy do tablicy obiektów
        if (this.tasks == null) {
            let task = [];
            task.push(myTask);
            this.updateTaskList(task)

        } else {
            let currentArray = this.tasks;
            currentArray.push(myTask);
            this.updateTaskList(currentArray);
        }
    },

    /*
    Wyświetla listę obecnych tasków /test master 1
    */
    renderCurrentTasks: function () {
        if (this.tasks != null) {
            for (let e of this.tasks) {
                const isCompleted = e.completed ? true : "";

                let completedTask = { className: "" };
                if (isCompleted) {
                    completedTask = {
                        className: "task__block__layer",
                    }
                }

                const taskTemplate = `
                <div class="tasks__block tasks__block--grey ${completedTask.className}">
                    <div class="tasks__block__item tasks__block--center">
                
                        <i class="far fa-check-circle"></i>
                    </div>
                </div>
                <div class="tasks__dot tasks__dot--${e.color}"></div>
                <div class="tasks__block">
                    <p class="tasks__paragraph">${e.info}</p>
                </div>`;

                let newTask = document.createElement("article");
                newTask.classList.add("tasks__box");
                newTask.setAttribute("data-todo-id", e.id);
                newTask.innerHTML = taskTemplate;
                this.articles.appendChild(newTask);
            }
        }
    },

    setFinishedTask: function (id) {
        this.editTask(id, 'completed', true);
    },

    setUnfinishedTask: function (id) {
        this.editTask(id, 'completed', false);
    },

    /*
    Przetwarza tekst z inputa na label oraz dodaje checkboxa
    */
    newTask_onEnter: function (event) {
        if (event.keyCode == 13) {
            if (event.target.value == "") {
                return;
            }

            if (event.target.tagName == "INPUT" && event.target.getAttribute("id") == "addTaskInput") {
                let color = this.newItemColors.random();

                this.displayTask(event, color);
                this.addTask(event.target.value, color);
                this.checkboxObserver();
                this.renderParagraphs();
                this.addTaskTemplate();
                this.newTaskButton.disabled = false;
            }
            else if (event.target.tagName == "INPUT" && event.target.getAttribute("id") == "editTaskInput") {
                this.displayTask(event);
                //this.addTask(event.target.value);
                //this.checkboxObserver();

                //jeśli pominiemy `ifa` to w przypadku, gdy dodajemy taski i jest widoczny input[addTaskInput] to po edycji danego taska pojawi się drugi input[addTaskInput] 
                if (this.isNewTaskTemplateVisible == false) {
                    this.addTaskTemplate();
                }
                document.querySelector("input[id='addTaskInput']").focus();
                this.newTaskButton.disabled = false;
            }
        }
    },

    /*
    Edytuje właściwość taska o danym id na nową wartość 
    */
    editTask: function (id, property, value) {
        const arrayIndex = this.tasks.findIndex(obj => obj.id == id);
        this.tasks[arrayIndex][property] = value;
        this.updateTaskList(this.tasks);
    },

    /*
    Cały `config` jak ma wyglądać `label` oraz `checkbox`
    */
    displayTask: function (event, color) {
        if (this.tasks != null) {
            if (this.tasks.length != undefined) {
                if ('id' in this.tasks[this.tasks.length - 1]) {
                    this.taskId = this.tasks[this.tasks.length - 1].id + 1;
                }
                else {
                    this.taskId += 1;
                }
            }
        }
        else {
            this.taskId = 0;
        }

        const taskTemplate = `
                <div class="tasks__block tasks__block--grey">
                    <div class="tasks__block__item tasks__block--center">
                        <input class="form__control__input form__controlCheckbox--hidden" type="checkbox">
                        <i class="far fa-check-circle"></i>
                    </div>
                </div>
                <div class="tasks__dot tasks__dot--${color}"></div>
                <div class="tasks__block">
                    <p class="tasks__paragraph">${event.target.value}</p>
                </div>`;

        let newTask = document.createElement("article");
        newTask.classList.add("tasks__box");
        newTask.setAttribute("data-todo-id", this.taskId);
        newTask.innerHTML = taskTemplate;
        this.articles.appendChild(newTask);
        this.removeCurrentTemplate(event);

        //[...this.ul.querySelectorAll("input[type='text']")][0].parentElement.replaceWith(label);
    },

    /*
    W momencie, gdy dodajemy taska, widoczny jest input do wpisania treści.
    Poniższy kod go usuwa.
    */
    removeCurrentTemplate: function (event) {
        event.target.parentElement.parentElement.parentElement.remove();
    },

    /*
    Podczas klikania na dane zadanie, pojawia się/znika `maska` tj. tło.
    Skrypt niżej w zależności nakłada je bądź usuwa.
    */
    task_onClick: function (e) {
        let tagName = e.target.tagName;
        let taskId;
        let taskContainer;

        if (tagName == "P") {
            taskContainer = e.target.parentElement.parentElement;
            taskId = taskContainer.dataset.todoId;
            taskContainer.children[0].classList.add("task__block__layer");
            this.setFinishedTask(taskId);
        }
        else if (tagName == "ARTICLE") {
            taskContainer = e.target;
            taskId = taskContainer.dataset.todoId;
            taskContainer.children[0].classList.add("task__block__layer");
            this.setFinishedTask(taskId);
        }
        else if (tagName == "DIV") {
            taskContainer = e.target;
            taskId = taskContainer.parentElement.parentElement.dataset.todoId;
            taskContainer.parentElement.classList.remove("task__block__layer")
            this.setUnfinishedTask(taskId);
        }
        else if (tagName == "svg") {
            taskContainer = e.target;
            taskId = taskContainer.parentElement.parentElement.parentElement.dataset.todoId;
            taskContainer.parentElement.parentElement.classList.remove("task__block__layer");
            this.setUnfinishedTask(taskId);
        }
        else if (tagName == "path") {
            taskContainer = e.target;
            taskId = taskContainer.parentElement.parentElement.parentElement.parentElement.dataset.todoId;
            this.setUnfinishedTask(taskId);
            taskContainer.parentElement.parentElement.parentElement.classList.remove("task__block__layer");
        }
        else {
            console.log(e.target.tagName);
        }
    },

    /*
    Funkcja, która odpala się po wciśnięciu przycisku "NOWE ZADANIE"
    */
    newTaskButton_onClick: function () {
        this.addTaskTemplate();
        this.newTaskButton.disabled = true;
    },

    /*
    Usuwa zaznaczone taski wg checkboxów
    */
    removeSelectedTasksButton_onClick: function () {
        const tasksContainer = this.articles;
        let completedTasks = this.tasks.filter(el => el.completed == true);
        for (const currentTask of completedTasks) {
            tasksContainer.querySelector("article[data-todo-id='" + currentTask.id + "']").remove();
        }

        let uncompletedTasks = this.tasks.filter(e => e.completed == false);
        this.updateTaskList(uncompletedTasks);
        this.renderParagraphs();

        //Po usunięciu ostatniego elementu z `TodoList` w obiekcie zostawało []/0/true więc trzeba się tego pozbyć aby `TodoList` było w zupełności puste
        if (localStorage.getItem("TodoList") == "[]" || localStorage.getItem("TodoList") == "0" || localStorage.getItem("TodoList") == "true") {
            localStorage.removeItem("TodoList");
            this.tasks = null;
            this.checkboxObserver();
        }
    },

    /*
    Aktualizuje listę tasków
    */
    updateTaskList: function (task) {
        localStorage.setItem("TodoList", JSON.stringify(task));
        this.tasks = this.getTaskList();
    },

    /*
    Zwraca listę tasków
    */
    getTaskList: function () {
        return JSON.parse(localStorage.getItem("TodoList"));
    },

    /*
    Sprawdza czy istnieją jakiekolwiek "taski".
    W zależności wyświetli przycisk do usuwania zaznaczonych tasków.
    */
    checkboxObserver: function () {
        if (this.tasks != null) {
            this.removeSelectedTasksButton.style.display = "block";
        }
        else if (this.tasks == null) {
            this.removeSelectedTasksButton.style.display = "none";
        }
    }
}

Todo.init();

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}