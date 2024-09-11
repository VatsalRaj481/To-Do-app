document.addEventListener
("DOMContentLoaded",()=>

    {
        //accessing the element
        const taskInput=document.getElementById("new-task");
        const addTaskButton =document.getElementById("add-task-button");
        const apiUrl="https://jsonplaceholder.typicode.com/todos";
        const taskList=document.getElementById("task-list");

        //EventListener to add an element
        addTaskButton.addEventListener("click",function()
        {
            let taskText=taskInput.value.trim();
            if(taskText!=="")
            {
                addTask(taskText);
                taskInput.value="";
            }
        })
        
        function addTask(taskText)
        {
            const newTask={title:taskText,completed:false};
            fetch(apiUrl,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify(newTask),
                }
            )
                .then((response)=>response.json())
                .then((task)=>{
                    console.log(task);
                    displayTask(task.title,task.id);
                })
                .catch((error)=>console.error("Failed during task",error));  
        }

        //Display an element
        function displayTask(title,id)
        {
            const li=document.createElement("li");
            li.setAttribute("data-id",id);
            const span=document.createElement("span");
            span.textContent=title;

            const editBtn=document.createElement("button");
            editBtn.textContent="Edit";
            editBtn.className="edit-btn";
            editBtn.addEventListener("click",()=>editTask(id,span));

            const deleteBtn=document.createElement("button");
            deleteBtn.textContent="Delete";
            deleteBtn.className="delete-btn";
            deleteBtn.addEventListener("click",()=>deleteTask(id,li));
            
            taskList.appendChild(li);
            li.appendChild(span);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
        }

        function editTask(id,span)
        {
            const newText=prompt("Edit Task",span.textContent);
            if(newText!=="" && newText!==null)
            {
                const updateTask={
                    title:span.textContent,
                    completed:false};
                fetch(`${apiUrl}/${id}`,{
                    method:"PATCH",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify(updateTask),
                }).then((response)=>{console.log(response)
                    if(response.ok===false)
                    {
                        throw new Error("Failed to edit");
                    }
                    return response.json()
                }).then(()=>{
                    span.textContent=newText;
                })
            }
        }

        function deleteTask(id,li)
        {
            fetch(`${apiUrl}/${id}`,
                {method:"DELETE",} 
            ).then((response)=>{
                if(response.ok===true)
                {
                    taskList.removeChild(li);
                }
                else{
                    throw new Error("failes to delete task");
                }
            }).catch((error)=>console.error("error in deleting task",error));
        }

    
    });