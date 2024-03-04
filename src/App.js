
import './App.css';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import Add from './components/Add/Add';

function App() {
  const [allTodos, setTodos] = useState([]);
 
  const [completedTodo, setCompletedTodo] = useState([]);
 
  const [currentEdit, setCurrentEdit] = useState('');
  const [currentEditedItem, setCurrentEditedItem] = useState('');
  const [isCompleteScreen, setIsCompleteScreen]=useState(false);

  // Existing code...
 //Handle Import data JSON API

 const importData = () => {
  fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => {
          // Filter items based on completion status
          const todoItems = data.filter(item => !item.completed);
          const completedItems = data.filter(item => item.completed);

          // Get existing todos from local storage
          let existingTodos = JSON.parse(localStorage.getItem('todolist')) || [];
          let existingCompletedTodos = JSON.parse(localStorage.getItem('completedTodo')) || [];

          // Add new todos to existing todos
          existingTodos = [...existingTodos, ...todoItems];
          existingCompletedTodos = [...existingCompletedTodos, ...completedItems];

          // Save updated todos to local storage
          localStorage.setItem('todolist', JSON.stringify(existingTodos));
          localStorage.setItem('completedTodo', JSON.stringify(existingCompletedTodos));

          // Update state with imported data
          setTodos(existingTodos);
          setCompletedTodo(existingCompletedTodos);

          console.log('Todos added to local storage:', existingTodos);
          console.log('Completed todos added to local storage:', existingCompletedTodos);
      })
      .catch(error => console.error('Error:', error));
};

 

const clearData = () => {
  localStorage.clear();
  setTodos([]);
  setCompletedTodo([]);
};


  const handleAddTodo = (title) => {
    let newTodoItem = { title };
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  // Existing code...

  //To delete list
const handleDeleteTodo=(index)=>{
  let reducedTodo =[...allTodos];
  reducedTodo.splice(index,1);    // remove item at specific index

  localStorage.setItem('todolist',JSON.stringify(reducedTodo));
  setTodos(reducedTodo);

}

//before use effects handle delete in completed
const handleDeleteCompletedTodo=(index)=>{
  let reducedTodo =[...completedTodo];
  reducedTodo.splice(index,1);    // remove item at specific index

  localStorage.setItem('completedTodo',JSON.stringify(reducedTodo));
  setCompletedTodo(reducedTodo);
}


// for local storage
  useEffect(()=>{
    let savedTodo= JSON.parse(localStorage.getItem('todolist'))
    let savedcompletedTodo= JSON.parse(localStorage.getItem('completedTodo'))

    if(savedTodo){
      setTodos(savedTodo);
    }

    if(savedcompletedTodo){
      setCompletedTodo(savedcompletedTodo)
    }

   
  },[])

  

  //for completed tasks
  const handlecomplete= (index)=>{
    let filteredItem={
      ...allTodos[index]
    }
  
    let updatecompletedArr= [...completedTodo];
  
    updatecompletedArr.push(filteredItem);
    setCompletedTodo(updatecompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodo',JSON.stringify(updatecompletedArr));
  }


  //for handle edit
  const handleEdit=(ind,item)=>{
    setCurrentEdit(ind);
    setCurrentEditedItem(item);

  }
  const handleUpdatetitle=(value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev, title:value}
    })

  }

  //Edit Handle Button
const handleUpdateTodo=()=>{
  let newToDo = [...allTodos];
  newToDo[currentEdit] = currentEditedItem;
  setTodos(newToDo);
  setCurrentEdit("");
}

  return (
    <div className="App">
      <h1>My To Do</h1>
      <div className="todo-wrapper">
        <Add addTodo={handleAddTodo} />
        {/* Render the list of todos here */}

          {/* Button Toddo Completed and Import Data and Clear */}

          <div className="button-area">
  <div className="button-group">
    <button
      className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
      onClick={() => setIsCompleteScreen(false)}
    >
      Todo
    </button>
    <button
      className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
      onClick={() => setIsCompleteScreen(true)}
    >
      Completed
    </button>
  </div>
  <div className="button-group1">
    <button className="secondaryBtn" type="button" onClick={importData}>
      Import Todo List
    </button>
    <button className="secondaryBtn" type="button" onClick={clearData}>
      Clear Data
    </button>
  </div>
</div>



      {/*If we is not in Complete screen  */}
      <div className="todo-list">
      {isCompleteScreen=== false && allTodos.map((item,index)=>{
       if( currentEdit===index )
       {
        return(
          <div className="edit__wrapper" key={index}>
          <input placeholder='Updated Title' 
          onChange={(e)=>handleUpdatetitle(e.target.value)} 
          value={currentEditedItem.title} rows={4}/>
           <button type='button' onClick={handleUpdateTodo} className='primary-button'>Update</button>
          
        </div>
        )
       }
       else{
       
        return(
          <div className="todo-list-item" key={index}>
          <h4>{item.title}</h4>
          <div>

        {/*Todo Lists Delete Button  */}
        <AiOutlineDelete 
        className='icon' 
        onClick={()=>handleDeleteTodo(index)}
         title='delete?'></AiOutlineDelete>

          {/* Todo List Complete Button */}
        <BsCheckLg 
        className='check-icon' 
        title='complete?' 
        onClick={()=>handlecomplete(index)}></BsCheckLg>
        
        {/* Todo List Edit Button */}
        <AiOutlineEdit className='check-icon' 
        title='Edit?' 
        onClick={()=>handleEdit(index,item)}>
        </AiOutlineEdit>

        </div>
      </div>
        )
      }
      })}

      {/* If we are in Complete Screen */}
    {isCompleteScreen=== true && completedTodo.map((item,index)=>{
        return(
          <div className="todo-list-item" key={index}>
          <h4>{item.title}</h4>
          <div>

        {/*To do list Delete Button */}
        <AiOutlineDelete 
        className='icon' 
        onClick={()=>handleDeleteCompletedTodo(index)} t
        itle='delete?'></AiOutlineDelete>
       
        </div>
      </div>
        )

      })}
      </div>
      </div>
    </div>
  );
}

export default App;
