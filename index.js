    document.addEventListener('DOMContentLoaded', () => {
        let tasks = []
        const addTask = document.getElementById('addTask')
        const taskInput = document.getElementById('taskInput')
        const taskList = document.getElementById('taskList')

        let stored = localStorage.getItem('tasks')
        if (stored) {
            tasks = JSON.parse(stored)
            tasks.forEach(task => renderTask(task));
        }

        // Save tasks in localstorage for persistent data
        function saveTaskToLocalStorage(task){
            localStorage.setItem('tasks', JSON.stringify(task))
        }

        // create task
        addTask.addEventListener('click', () => {
            if (taskInput.value === '') {
                alert("you can't submit empty list")
                return
            }
            const uniqueId = Date.now()
            
            const task = {
                id: uniqueId,
                text: taskInput.value,
                completed: false
            }
            tasks.push(task)
            saveTaskToLocalStorage(tasks)
            renderTask(task)
            
            taskInput.value = ''
        })

        // Render Task on screen
        function renderTask(task){
            let list = document.createElement('li')
            let deleteBtn = document.createElement('button')
            let text = document.createElement('span')

            list.id = task.id
            deleteBtn.id = task.id
            deleteBtn.innerText = 'delete Task'
            text.innerText = task.text
            list.appendChild(text) 
            list.classList.add('list')
            deleteBtn.classList.add('deleteBtn')
            list.appendChild(deleteBtn)
            taskList.appendChild(list)
            const targetId = task.id

            // Mark task for completion state
            list.addEventListener('click', (e)=>{
                if (Number(e.currentTarget.id) === targetId) {
                    const updateTaskState = tasks.forEach(task =>{
                        if (task.id === targetId) {
                          text.classList.toggle('done')
                          task.completed = !task.completed
                        }
                    })
                    saveTaskToLocalStorage(updateTaskState)
                }
            })

            // delete task
            deleteBtn.addEventListener('click', (e) => {
                if (Number(e.currentTarget.id) === targetId) {
                    const deletedTask = tasks.filter(task => task.id !== targetId)
                    saveTaskToLocalStorage(deletedTask)
                    list.style = "display: none"
                }
            })
        }

    })