import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  
  state = {
    tasks: [],
    taskname: '',
  }

  componentDidMount(){
    this.socket = io('http://localhost:8000');
    this.socket.on('addTask', (task) => this.addTask(task.name));
    this.socket.on('removeTask', (task) => this.removeTask(task.id, !task.bool));
    this.socket.on('updateData', (task) => this.updateTask(task));
  }

  removeTask(id, taskForDel){
    let newArray = [...this.state.tasks];
    newArray = newArray.filter( task => {
      return task.id !== id;
    });
    this.setState({tasks: newArray});
    if(taskForDel) {
      this.socket.emit('removeTask', id);
    }
  }

  changeName = (event) => {
    this.setState({taskName: event.target.value})
  }
  submitForm = event =>{
    event.preventDefault();
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName);
  }

  addTask = taskAll =>{
    const{tasks} = this.state;
    const newArrayTasks = [...tasks];
    newArrayTasks.push({id: newArrayTasks.length + 1, name: taskAll});
    this.setState({tasks: newArrayTasks});
  }

  updateTasks = (allTasks) => {
    this.setState({tasks: allTasks})
  }

  render() {

    const allTasks = this.state.tasks.map((taskDisplay, index) =>(
      <li key={index} className="task">{taskDisplay.name}<button className="btn btn--red" onClick={() => this.removeTask(taskDisplay.id, true)}>Remove</button></li>
    ));
    
    return (

      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {allTasks}
          </ul>
    
          <form id="add-task-form" onSubmit={this.submitForm}>
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={this.state.taskName} onChange={this.changeName} />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;