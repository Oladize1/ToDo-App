    document.addEventListener('DOMContentLoaded', () => {
        let tasks = []
        const addTask = document.getElementById('addTask')
        const taskInput = document.getElementById('taskInput')
        const taskList = document.getElementById('taskList')
        const showAll = document.getElementById('showAll')
        const showCompleted = document.getElementById('showCompleted')
        const showUncompleted = document.getElementById('showUncompleted')
        const searchInput = document.getElementById('searchInput')
        const dueDateInput = document.getElementById('dueDate')
        const sortByDueDate = document.getElementById('sortByDueDate')
        

        searchInput.addEventListener('keyup', ()=> {
            const search = tasks.filter(task => task.text.toLowerCase().includes(searchInput.value.toLowerCase()))
            taskList.innerHTML = ''
            search.forEach(renderTask)
            
        })

        // FilterTask Function
        function filterTask(filterType){
            taskList.innerHTML = ''
            if (filterType === 'completed') {
                tasks.filter(task => task.completed === true).forEach(renderTask)
            }else if (filterType === 'unCompleted') {
                tasks.filter(task => task.completed === false).forEach(renderTask)
            }else if(filterType === 'all') {
                tasks.forEach(renderTask)
            }else if(filterType === 'sortByDueDate'){
                tasks.sort((a, b) =>{
                    if(!a.dueDate) return 1
                    if(!b.dueDate) return -1
                    return new Date(a.dueDate) - new Date(b.dueDate)
                })
                tasks.forEach(renderTask)
            }
        }
        showAll.addEventListener('click', () => {
            filterTask('all')
        })
        showCompleted.addEventListener('click', () => {
            filterTask('completed')
        })
        showUncompleted.addEventListener('click', () => {
            filterTask('unCompleted')
        })
        sortByDueDate.addEventListener('click', ()=>{
            console.log('sort clicked');
            
            filterTask('sortByDueDate')
        })
        let stored = localStorage.getItem('tasks')
        if (stored && stored !== 'undefined') {
            tasks = JSON.parse(stored)
            tasks.forEach(task => renderTask(task));
        }

        // Save tasks in localstorage for persistent data
        function saveTaskToLocalStorage(task){
            localStorage.setItem('tasks', JSON.stringify(task))
        }

        // create task
        addTask.addEventListener('click', (e) => { 
            if (taskInput.value === '') {
                alert("you can't submit empty list")
                return
            }
            
            const uniqueId = Date.now()
            
            const task = {
                id: uniqueId,
                text: taskInput.value,
                dueDate: dueDateInput.value || null,
                completed: false
            }
            tasks.push(task)
            saveTaskToLocalStorage(tasks)
            renderTask(task)
            
            taskInput.value = ''
            dueDateInput.value = ''
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
            let textDiv = document.createElement('div')
            let deleteBtn = document.createElement('button')
            let editBtn = document.createElement('button')
            let text = document.createElement('span')
            let dueDateText = document.createElement('span')
            dueDateText.classList.add('dueDate')
            list.id = task.id
            deleteBtn.id = task.id
            editBtn.id = task.id
            dueDateText.id = task.id

            deleteBtn.innerText = 'delete Task'
            editBtn.innerText = 'Edit Task'
            dueDateText.innerText = `Due: ${task.dueDate}`
            text.innerText = task.text

            textDiv.appendChild(text)
            if (task.dueDate !== null) {
                textDiv.appendChild(dueDateText)
            }
            list.appendChild(textDiv) 
            list.classList.add('list')
            textDiv.classList.add('text-div')
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
                if(e.target.tagName.toLowerCase() === 'button') return;
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