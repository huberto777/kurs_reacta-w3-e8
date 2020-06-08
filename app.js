class TimeboxCreator extends React.Component {
  state = {
    title: "",
    totalTimeInMinutes: "",
  };
  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  add = () => {
    const { onCreate } = this.props;
    const { title, totalTimeInMinutes } = this.state;
    if (title.length < 3 || totalTimeInMinutes <= 0) return alert('complete all inputs fields');
    onCreate({
      id: uuid.v4(),
      title,
      totalTimeInMinutes,
    });
    this.setState({
      title: "",
      totalTimeInMinutes: "",
    });
  };
  render() {
    const { title, totalTimeInMinutes } = this.state;

    return (
      <div className="TimeboxCreator">
        <label>
          Co robisz?
          <input
            value={title}
            type="text"
            onChange={this.handleInputChange}
            name="title"
          />
        </label>
        <br />
        <label>
          Ile minut?
          <input
            value={totalTimeInMinutes}
            type="number"
            onChange={this.handleInputChange}
            name="totalTimeInMinutes"
          />
        </label>
        <br />
        <button onClick={this.add}>dodaj timebox</button>
      </div>
    );
  }
}

class EditTimebox extends React.Component {
  state = {
    title: this.props.task.title,
    totalTimeInMinutes: this.props.task.totalTimeInMinutes,
  };
  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  update = () => {
    const { task, onUpdate } = this.props;
    const { title, totalTimeInMinutes } = this.state;
    if (title.length < 3 || totalTimeInMinutes <= 0) return alert('complete all inputs fields');
    onUpdate({ ...task, title, totalTimeInMinutes });
  };
  render() {
    const { title, totalTimeInMinutes } = this.state;
    const { cancelEdit, task } = this.props;
    return (
      <div className="TimeboxEditor">
        <label>title:</label>
        <input
          type="text"
          value={title}
          name="title"
          onChange={this.handleInput}
        />
        <br />
        <label>time:</label>
        <input
          type="number"
          value={totalTimeInMinutes}
          name="totalTimeInMinutes"
          onChange={this.handleInput}
        />
        <br />
        <button type="submit" onClick={this.update}>
          update
        </button>
        <button onClick={cancelEdit}>cancel</button>
      </div>
    );
  }
}

const Timebox = ({ task, onDelete, onEdit, isEditable }) => (
  <>
    <div className="Timebox">
      <h3>
        {task.title} - {task.totalTimeInMinutes} min.
      </h3>

      {isEditable || (
        <>
          <button onClick={onDelete}>usuń</button>
          <button onClick={onEdit}>edycja</button>
        </>
      )}
    </div>
  </>
);

class TimeboxList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      timeboxes: [
        {
          id: "a",
          title: "uczę sie reacta",
          totalTimeInMinutes: 10,
        },
        {
          id: "b",
          title: "uczę sie laravela",
          totalTimeInMinutes: 23,
        },
        {
          id: "c",
          title: "uczę sie js es6",
          totalTimeInMinutes: 22,
        },
      ],
    };
  }

  handleCreate = (createdTimebox) => {
    this.setState((prevState) => ({
      timeboxes: [createdTimebox, ...prevState.timeboxes], // dodajemy element na początku tablicy
    }));
  };

  handleDelete = ({id}) => {
    const index = this.state.timeboxes.findIndex(
      (timebox) => timebox.id === id
    );
    this.state.timeboxes.splice(index, 1);
    this.setState((prevState) => ({
      timeboxes: prevState.timeboxes,
    }));
  };

  handleEditTimebox = (task) => {
    this.setState({
      task,
      isEditable: true,
    });
  };

  cancelEdit = () => {
    this.setState({
      isEditable: false,
    });
  };

  handleUpdateTimebox = (updatedTimebox) => {
    this.setState({
      timeboxes: this.state.timeboxes.map((timebox) =>
        timebox.id === updatedTimebox.id ? updatedTimebox : timebox
      ),
      isEditable: false,
    });
  };

  render() {
    const { isEditable, task } = this.state;
    return (
      <>
        {isEditable ? (
          <EditTimebox
            task={task}
            onUpdate={this.handleUpdateTimebox}
            cancelEdit={this.cancelEdit}
          />
        ) : (
          <>
            <TimeboxCreator onCreate={this.handleCreate} />
            {this.state.timeboxes.map((task) => (
              <Timebox
                key={task.id}
                task={task}
                onDelete={() => this.handleDelete(task)}
                onEdit={() => this.handleEditTimebox(task)}
              />
            ))}
          </>
        )}
      </>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TimeboxList />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
