    document.addEventListener('DOMContentLoaded', () => {
        let tasks = []
        const addTask = document.getElementById('addTask')
        const taskInput = document.getElementById('taskInput')
        const taskList = document.getElementById('taskList')
        let stored = localStorage.getItem('tasks')
        if (stored && stored !== 'undefined') {
            console.log("stored value", stored);
            
            tasks = JSON.parse(stored)
            tasks.forEach(task => renderTask(task));
        }

        // Save tasks in localstorage for persistent data
        function saveTaskToLocalStorage(task){
            localStorage.setItem('tasks', JSON.stringify(task))
        }

        // create task
        addTask.addEventListener('click', (e) => {
            // if(e.target.tagName.toLowerCase() === 'button') return; 
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
        taskInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                addTask.click()
            }
        })

        // Render Task on screen
        function renderTask(task){
            let list = document.createElement('li')
            let div = document.createElement('div')
            let deleteBtn = document.createElement('button')
            let editBtn = document.createElement('button')
            let text = document.createElement('span')

            list.id = task.id
            deleteBtn.id = task.id
            editBtn.id = task.id
            deleteBtn.innerText = 'delete Task'
            editBtn.innerText = 'Edit Task'
            text.innerText = task.text
            list.appendChild(text) 
            list.classList.add('list')
            div.classList.add('btn-div')
            deleteBtn.classList.add('deleteBtn')
            editBtn.classList.add('editBtn')
            div.appendChild(editBtn)
            div.appendChild(deleteBtn)
            list.appendChild(div)
            taskList.appendChild(list)
            const targetId = task.id

            if (task.completed) {
                text.classList.add('done')
            }

            // Mark task for completion state
            list.addEventListener('click', (e)=>{
                if (Number(e.currentTarget.id) === targetId) {
                    text.classList.toggle('done')
                    tasks.forEach(task =>{
                        if (task.id === targetId) {
                          task.completed = !task.completed
                        }
                    })
                    saveTaskToLocalStorage(tasks)
                }
            })

            //edit task
            editBtn.addEventListener('click', (e) => {
                if (Number(e.currentTarget.id) === targetId) {
                    tasks.forEach(task => {
                        if (task.id === targetId) {
                            const newText = window.prompt('', task.text)
                            if (newText !== null && newText.trim() !== '') {
                                task.text = newText
                                task.completed = false
                            }
                        }
                    })
                    saveTaskToLocalStorage(tasks)
                    taskList.innerHTML = ''
                    tasks.forEach(renderTask)
                }
            })

            // delete task
            deleteBtn.addEventListener('click', (e) => {
                if (Number(e.currentTarget.id) === targetId) {
                    tasks = tasks.filter(task => task.id !== targetId)
                    saveTaskToLocalStorage(tasks)
                    list.remove()
                }
            })
        }

    })