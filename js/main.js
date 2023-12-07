/**
 * @namespace task
 * @description Módulo que contiene la lógica para administrar tareas.
 */
const task = (() => {
  "use strict";

  /**Arreglo */
  const registros = [];

  /**Variables */
  const newTaskInput = document.querySelector(".new__task-input");
  const dateClassInput = document.querySelector(".date__class-input");
  const addTaskButtom = document.querySelector(".add__task-buttom");
  const dateClassLabel = document.querySelector(".date__class-label");
  const todoList = document.querySelector(".todo-list");
  const clearCompleted = document.querySelector(".clear-completed");


  /**==================================Eventos===================================================*/

  // Obtener registros almacenados en localStorage al cargar la página
  window.addEventListener("load", () => {
    const storedRegistros = localStorage.getItem("registros");
    if (storedRegistros) {
      registros.push(...JSON.parse(storedRegistros));
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
  });

  /**Muestra todas las tareas */
  const all = document.querySelector(".all");
  all.addEventListener("click", () => {
    const todoItems = todoList.querySelectorAll(".completed");
    todoList.innerHTML = "";
    todoItems.forEach((item) => {
      todoList.appendChild(item);
    });
  });

  /**Hacer click en el checkbox */
  // En este código, cuando se hace clic en el checkbox, se busca el elemento label__task que es hijo del mismo elemento padre del checkbox. Si el checkbox está marcado, se aplica el estilo text-decoration: line-through; al label__task. Si el checkbox no está marcado, se remueve el estilo text-decoration.
  todoList.addEventListener("click", function (event) {
    if (event.target.matches('input[type="checkbox"]')) {
      const taskLabel =
        event.target.parentElement.querySelector(".label__task");
      if (event.target.checked) {
        taskLabel.style.textDecoration = "line-through";
        marcarTareaCompletada();
      } else {
        taskLabel.style.textDecoration = "none";
        marcarTareaPendiente();
      }
    }
  });

  /**Hacer click en el botón de eliminar tarea*/
  todoList.addEventListener("click", function (event) {
    if (event.target.matches('button[type="button"]')) {
      const todoItem = event.target.parentElement.parentElement;
      todoList.removeChild(todoItem);
    }
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

  /**Funciones */

  // Función para agregar una nueva tarea
  function agregarTarea() {
    // Código para agregar la tarea

    // Actualizar el arreglo registros
    const nuevaTarea = {
      tarea: newTaskInput.value,
      fechaEntrega: dateClassInput.value,
      completado: false,
    };
    registros.push(nuevaTarea);

    // Actualizar localStorage
    localStorage.setItem("registros", JSON.stringify(registros));
  }

  // Función para marcar una tarea como completada
  function marcarTareaCompletada() {
    // Código para marcar la tarea como completada

    // Actualizar el arreglo registros
    const tareaCompletada = registros.find((tarea) => tarea.tarea === "TAREA");
    if (tareaCompletada) {
      tareaCompletada.completado = true;
    }

    // Actualizar localStorage
    localStorage.setItem("registros", JSON.stringify(registros));
  }

  //Función para marcar una tarea como pendiente
  function marcarTareaPendiente() {
    // Código para marcar la tarea como pendiente

    // Actualizar el arreglo registros
    const tareaPendiente = registros.find((tarea) => tarea.tarea === "TAREA");
    if (tareaPendiente) {
      tareaPendiente.completado = false;
    }

    // Actualizar localStorage
    localStorage.setItem("registros", JSON.stringify(registros));
  }

  // Función para eliminar una tarea
  function eliminarTarea() {
    // Código para eliminar la tarea

    // Actualizar el arreglo registros
    const tareaEliminadaIndex = registros.findIndex(
      (tarea) => tarea.tarea === "TAREA"
    );
    if (tareaEliminadaIndex !== -1) {
      registros.splice(tareaEliminadaIndex, 1);
    }

    // Actualizar localStorage
    localStorage.setItem("registros", JSON.stringify(registros));
  }
  function initializePage() {
    registros.forEach((registro) => {
      newTaskInput.value = registro.tarea;
      dateClassInput.value = registro.fecha;
      addTask();
      updatePendingCount();
    });
  }

  /**Validación de campos */
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
      dateClassLabel.textContent = "¡Corrige la fecha!";
      return;
    } else {
      dateClassLabel.textContent = "";
    }

    addTask();
  }

  /**Calcula los días que faltan para la entrega */
  function daysLeft() {
    const currentDate = new Date();
    console.log(currentDate);
    const inputDate = new Date(dateClassInput.value + "T18:00:00");
    console.log(inputDate);
    const daysLeft = inputDate - currentDate;
    const daysLeftInDays = daysLeft / (1000 * 60 * 60 * 24);

    return Math.floor(daysLeftInDays) + 1;
  }

  /**Limpiar campos */
  function clearFields() {
    newTaskInput.value = "";
    dateClassInput.value = "";
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
    toggleInput.checked = false;

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

    agregarTarea();
    clearFields();
    updatePendingCount();
  }

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
