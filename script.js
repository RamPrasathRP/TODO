// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const input = document.querySelector(".todo-input");
    const addButton = document.querySelector(".add-button");
    const todosHtml = document.querySelector(".todos");
    const emptyImage = document.querySelector(".empty-image");
    const deleteAllButton = document.querySelector(".delete-all");
    const filters = document.querySelectorAll(".filter");
  
    // Local storage data retrieval or initialization
    let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
  
    // Filter status
    let filter = '';
  
    // Function to display todos
    function showTodos() {
      // Check if there are todos
      if (todosJson.length === 0) {
        todosHtml.innerHTML = '';
        emptyImage.style.display = 'block';
      } else {
        todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
        emptyImage.style.display = 'none';
      }
    }
  
    // Function to generate HTML for a todo item
    function getTodoHtml(todo, index) {
      if (filter && filter !== todo.status) {
        return ''; // Skip if filter is active and todo status doesn't match
      }
      const checked = todo.status === "completed" ? "checked" : "";
      return `
        <li class="todo ${checked}">
          <label>
            <input type="checkbox" ${checked} onchange="updateStatus(${index}, this)">
            <span>${todo.name}</span>
          </label>
          <button class="delete-btn" onclick="remove(${index})">
            <i class="fa fa-times"></i>
          </button>
        </li>
      `;
    }
  
    // Function to add a new todo
    function addTodo() {
      const todoName = input.value.trim();
      if (!todoName) {
        return; // Skip if todo name is empty
      }
      todosJson.unshift({ name: todoName, status: "pending" });
      input.value = '';
      updateLocalStorageAndShowTodos();
    }
  
    // Function to update the status of a todo
    function updateStatus(index, checkbox) {
      const todoItem = todosJson[index];
      todoItem.status = checkbox.checked ? "completed" : "pending";
      updateLocalStorageAndShowTodos();
    }
  
    // Function to remove a todo
    function remove(index) {
      todosJson.splice(index, 1);
      updateLocalStorageAndShowTodos();
    }
  
    // Function to update local storage and refresh displayed todos
    function updateLocalStorageAndShowTodos() {
      localStorage.setItem("todos", JSON.stringify(todosJson));
      showTodos();
    }
  
    // Event listener for filter buttons
    filters.forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (el.classList.contains('active')) {
          el.classList.remove('active');
          filter = '';
        } else {
          filters.forEach(tag => tag.classList.remove('active'));
          el.classList.add('active');
          filter = e.target.dataset.filter;
        }
        showTodos();
      });
    });
  
    // Event listener for deleting all todos
    deleteAllButton.addEventListener("click", function () {
      todosJson = [];
      updateLocalStorageAndShowTodos();
    });
  
    // Event listener for Enter key or add button to add a new todo
    input.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        addTodo();
      }
    });
  
    addButton.addEventListener("click", addTodo);
  
    // Initial display of todos when the page loads
    showTodos();
  });