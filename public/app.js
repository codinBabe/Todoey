function handleStrike(checkbox) {
    const taskIndex = checkbox.getAttribute("data-task-index");
    const taskInput = document.getElementById(`task${taskIndex}`);

    if (checkbox.checked) {
        taskInput.classList.add("checked");
    } else {
        taskInput.classList.remove("checked");
    }
}
