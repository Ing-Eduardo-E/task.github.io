/**
 * @namespace task
 * @description Módulo que contiene la lógica para administrar tareas.
 */
const task = (() => {
  "use strict";

  /**===========================Variables======================*/
  const newTaskInput = document.querySelector(".new__task-input");
  const dateClassInput = document.querySelector(".date__class-input");
  const checkboxClassInput = document.querySelector(".checkbox__class-input");
  const addTaskButtom = document.querySelector(".add__task-buttom");
  const dateClassLabel = document.querySelector(".date__class-label");
  const todoList = document.querySelector(".todo-list");
  const clearCompleted = document.querySelector(".clear-completed");

  /**
   * Array of registros.
   * @type {Array<Object>}
   */
  const registros = [
    {
      tarea: "Hacer la compra",
      fecha: getFutureDate(15),
      checkbox: true,
    },
    {
      tarea: "Llamar al médico",
      fecha: getFutureDate(5),
      checkbox: false,
    },
    {
      tarea: "Terminar el informe",
      fecha: getFutureDate(10),
      checkbox: false,
    },
  ];

  function getFutureDate(days) {
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.getTime() + days * 24 * 60 * 60 * 1000
    );
    return futureDate.toISOString().split("T")[0];
  }

  /**============================Eventos=========================*/
  window.addEventListener("load", () => {
    // Guardar registros en localStorage
    localStorage.setItem("registros", JSON.stringify(registros));

    // Verificar si existe el localStorage
    if (localStorage) {
      // Obtener los registros del localStorage
      const registrosFromLocalStorage = JSON.parse(
        localStorage.getItem("registros")
      );

      // Verificar si existen registros en el localStorage
      if (registrosFromLocalStorage) {
        // Llenar el arreglo 'registros' con los registros del localStorage
        registros.length = 0; // Limpiar el arreglo 'registros'
        registros.push(...registrosFromLocalStorage);
      } else {
        // Crear el localStorage con los registros iniciales
        localStorage.setItem("registros", JSON.stringify(registros));
      }
    } else {
      // Crear el arreglo 'registros' y el localStorage con los registros iniciales
      localStorage.setItem("registros", JSON.stringify(registros));
    }
    initializePage();
  });

  /**Click en el boron agregar tarea */
  addTaskButtom.addEventListener("click", () => {
    dataValidation();
  });

  /**Muestra solo las tareas completadas */
  const completed = document.querySelector(".completed");
  completed.addEventListener("click", () => {
    const todoItems = todoList.querySelectorAll(".completed");
    const checkedItems = Array.from(todoItems).filter(
      (item) => item.querySelector('input[type="checkbox"]').checked
    );
    todoList.innerHTML = "";
    checkedItems.forEach((item) => {
      todoList.appendChild(item);
    });
    updatePendingCount();
  });

  /**Muestra solo las tareas pendientes */
  const pending = document.querySelector(".pending");
  pending.addEventListener("click", () => {
    const todoItems = todoList.querySelectorAll(".completed");
    const checkedItems = Array.from(todoItems).filter(
      (item) => !item.querySelector('input[type="checkbox"]').checked
    );
    todoList.innerHTML = "";
    checkedItems.forEach((item) => {
      todoList.appendChild(item);
    });
    updatePendingCount();
  });

  /**Muestra todas las tareas */
  const all = document.querySelector(".all");
  all.addEventListener("click", () => {
    todoList.innerHTML = ""; // Remove all tasks from the list
    initializePage();
  });

  /**Hacer click en el checkbox */
  todoList.addEventListener("click", function (event) {
    if (event.target.matches('input[type="checkbox"]')) {
      const taskLabel =
        event.target.parentElement.querySelector(".label__task");
      if (event.target.checked) {
        taskLabel.style.textDecoration = "line-through";
      } else {
        taskLabel.style.textDecoration = "none";
      }

      // Actualizar el registro en el array
      const checkboxClassInput = event.target;
      const todoItem = checkboxClassInput.parentElement.parentElement;
      const index = Array.from(todoList.children).indexOf(todoItem);
      registros[index].checkbox = checkboxClassInput.checked;

      // Actualizar el registro en el localStorage
      localStorage.setItem("registros", JSON.stringify(registros));
    }
  });

  /**Hacer click en el botón de eliminar tarea*/
  todoList.addEventListener("click", function (event) {
    if (event.target.matches('button[type="button"]')) {
      const todoItem = event.target.parentElement.parentElement;
      todoList.removeChild(todoItem);

      // Eliminar la tarea del array
      const index = Array.from(todoList.children).indexOf(todoItem);
      registros.splice(index, 1);

      // Actualizar el localStorage
      localStorage.setItem("registros", JSON.stringify(registros));
    }
    updatePendingCount();
  });

  /**Evento para eliminar todas las tareas realizadas checked*/
  clearCompleted.addEventListener("click", function (event) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const todoItem = checkbox.parentElement.parentElement;
        if (todoList.contains(todoItem)) {
          todoList.removeChild(todoItem);
        }
      }
    });
    updatePendingCount();
  });

  /**checked a todas las listas y viceversa */
  const toggleAll = document.querySelector(".toggle-all");
  toggleAll.addEventListener("click", function (event) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = event.target.checked;
      const taskLabel = checkbox.parentElement.querySelector(".label__task");
      if (event.target.checked) {
        taskLabel.style.textDecoration = "line-through";
      } else {
        taskLabel.style.textDecoration = "none";
      }
    });
    updatePendingCount();
  });

  /**==========================Funciones====================*/

  /**
   * Inicializa la página al poblar las tareas desde el arreglo registros.
   */
  function initializePage() {
    registros.forEach((registro) => {
      newTaskInput.value = registro.tarea;
      dateClassInput.value = registro.fecha;
      checkboxClassInput.checked = registro.checkbox;
      addTask();
      updatePendingCount();
    });
  }

  /**
   * Validates the data entered by the user.
   */
  function dataValidation() {
    const currentDate = new Date();
    const inputDate = new Date(dateClassInput.value);

    if (newTaskInput.value === "") {
      console.log("Cuál es la tarea?");
      newTaskInput.placeholder = "¡Ingresa una tarea!";
      return;
    }

    if (
      dateClassInput.value === "" ||
      inputDate < currentDate.setDate(currentDate.getDate())
    ) {
      dateClassLabel.textContent = "¡Corrige la fecha!!!!";
      return;
    } else {
      dateClassLabel.textContent = "";
    }
    newtask(newTaskInput, dateClassInput, checkboxClassInput);
    updateLocalStorage(registros);
    addTask();
  }

  function newtask(newTaskInput, dateClassInput, checkboxClassInput) {
    // Agregar un nuevo registro al arreglo 'registros'
    registros.push({
      tarea: newTaskInput.value,
      fecha: dateClassInput.value,
      checkbox: checkboxClassInput.checked,
    });
  }

  function updateLocalStorage(registros) {
    // Actualizar el localStorage con los nuevos registros
    localStorage.setItem("registros", JSON.stringify(registros));
  }

  /**Calcula los días que faltan para la entrega */
  function daysLeft() {
    const currentDate = new Date();
    console.log(currentDate);
    const inputDate = new Date(dateClassInput.value + "T18:00:00");
    console.log(inputDate);
    const daysLeft = inputDate - currentDate;
    const daysLeftInDays = daysLeft / (1000 * 60 * 60 * 24);

    return Math.floor(daysLeftInDays);
  }

  /**Limpiar campos */
  function clearFields() {
    newTaskInput.value = "";
    dateClassInput.value = "";
    checkboxClassInput.checked = false;
  }

  /**Crear elementos de la lista */
  function addTask() {
    const todoList = document.querySelector(".todo-list");
    const daysLeftInDays = daysLeft();

    const todoItem = document.createElement("li");
    todoItem.classList.add("completed");
    todoItem.setAttribute("data-id", "abc");

    const viewDiv = document.createElement("div");
    viewDiv.classList.add("view");

    const toggleInput = document.createElement("input");
    toggleInput.classList.add("toggle");
    toggleInput.setAttribute("type", "checkbox");
    toggleInput.setAttribute("title", "checkbox");
    toggleInput.setAttribute("name", "toggleTask");
    toggleInput.checked = checkboxClassInput.checked;

    const taskLabel = document.createElement("label");
    taskLabel.classList.add("label__task");
    taskLabel.setAttribute("title", "task");
    taskLabel.textContent = newTaskInput.value;

    const missingLabel = document.createElement("label");
    missingLabel.classList.add("label__missing");
    missingLabel.setAttribute("title", "missing");

    const textSpan1 = document.createElement("span");
    textSpan1.classList.add("text__span");
    textSpan1.textContent = "Faltan";

    const numSpan = document.createElement("span");
    numSpan.classList.add("num__span");
    numSpan.textContent = daysLeftInDays;

    const textSpan2 = document.createElement("span");
    textSpan2.classList.add("text__span");
    textSpan2.textContent = "días";

    missingLabel.appendChild(textSpan1);
    missingLabel.appendChild(numSpan);
    missingLabel.appendChild(textSpan2);

    const destroyButton = document.createElement("button");
    destroyButton.setAttribute("type", "button");
    destroyButton.classList.add("destroy");
    destroyButton.setAttribute("title", "destroy");

    viewDiv.appendChild(toggleInput);
    viewDiv.appendChild(taskLabel);
    viewDiv.appendChild(missingLabel);
    viewDiv.appendChild(destroyButton);

    const editInput = document.createElement("input");
    editInput.classList.add("edit");
    editInput.setAttribute("title", "edit");
    editInput.setAttribute("name", "text");
    editInput.setAttribute("value", "Create a TodoMVC template");

    todoItem.appendChild(viewDiv);
    todoItem.appendChild(editInput);

    todoList.appendChild(todoItem);

    clearFields();
    updatePendingCount();
  }

  /**
   * @function updatePendingCount
   * @param {string} pendingCountElement - Elemento HTML que muestra la cantidad de tareas pendientes.
   * @description Actualiza el contador de tareas pendientes.
   * @example
   * updatePendingCount();
   */
  function updatePendingCount() {
    const todoList = document.querySelectorAll(".todo-list li");
    let pendingCount = 0;

    todoList.forEach((item) => {
      const checkbox = item.querySelector(".toggle");
      if (!checkbox.checked) {
        pendingCount++;
      }
    });

    const pendingCountElement = document.getElementById("pending-count");
    pendingCountElement.textContent = pendingCount;
  }
})();
