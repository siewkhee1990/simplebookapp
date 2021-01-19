// Set: setter
// useState: the constructor to give the original value
// var,const,let are basically declaring the variables
import "./App.css";
import { useEffect, useState } from "react";
import { Button, Tabs, Tab, Table, Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Here we write the functions!
function App() {
  const [thisUser, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");

  const [updateTitle, setUpdateTitle] = useState("");
  const [updateAuthor, setUpdateAuthor] = useState("");
  const [updateGenre, setUpdateGenre] = useState("");
  const [updateLanguage, setUpdateLanguage] = useState("");

  const [update, setUpdate] = useState(true);
  const [edit, setEdit] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //This is how you declare a variable!
  //const,let,var [(variable,setter] = constructor to set initial value([]);
  const [books, setBooks] = useState([]);

  const login = (event) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password!");
    } else {
      let data = {
        email: email,
        password: password,
      };
      axios
        .post("http://localhost:5000/books/login", data)
        .then((res) => {
          console.log(res.data);
          if (!res.data.token) {
            alert(res.data.message);
          } else {
            localStorage.setItem("token", res.data.token);
            setUpdate(!update);
            setEmail("");
            setPassword("");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //This is a purely empty function
  // const testing = () => {
  //   console.log("test")
  // }

  //Examples below lines 37 to 51 - Variable initiation
  // console.log(books) = []
  // let object = {}; useState({})
  //let a;useState("")
  //let b;useState("")
  //Ways to write functions!

  // function login() {

  // }

  // const login = () =>{

  // }

  // Here we write the axios code!
  // useEffect is a pre-defined function by JS
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUser(localStorage.getItem("token"));
    }
    axios
      .get("http://localhost:5000/books/")
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => console.log(err));
  }, [update]);

  //This is how we created the createBooks function!
  const createBooks = (event) => {
    event.preventDefault();
    if (!localStorage.getItem("token") || !thisUser) {
      alert("Please login to add books!");
    } else {
      if (!title || !author || !genre || !language) {
        alert("Please fill in required field!");
      } else {
        //let submitDate = new Date(date.setHours(date.getHours() + 8));
        let data = {};
        [data.title, data.author, data.genre, data.language, data.addedBy] = [
          title,
          author,
          genre,
          language,
          localStorage.getItem("token"),
        ];

        axios
          .post("http://localhost:5000/books/create", data, {
            headers: { token: localStorage.getItem("token") },
          })
          .then((res) => {
            console.log(res.data);
            alert(res.data.message);
            setTitle("");
            setAuthor("");
            setGenre("");
            setLanguage("");
            //setDate("");
            setUpdate(!update);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  // DO WE NEED THIS PART???
  // const setTheDate = (input) => {
  //   // let date = new Date(input);
  //   input.setHours(input.getHours() + 8);
  //   setDate(date);
  // };

  const updateBooks = (event, original) => {
    event.preventDefault();
    if (!updateTitle && !updateAuthor && !updateGenre && !updateLanguage) {
      alert("nothing to update!");
    } else if (!localStorage.getItem("token")) {
      alert("not allowed!");
    } else {
      //let newDate = new Date(updateDate.setHours(updateDate.getHours() + 8));
      let data = {};
      data.id = original.id;
      data.title = updateTitle || original.title;
      data.author = updateAuthor || original.author;
      data.genre = updateGenre || original.genre;
      data.language = updateLanguage || original.language;
      axios
        .put("http://localhost:5000/books/" + original.id, data, {
          headers: { token: localStorage.getItem("token") },
        })
        .then((res) => {
          alert(res.data.message);
          setUpdate(!update);
          setEdit(null);
          setUpdateTitle("");
          setUpdateAuthor("");
          setUpdateGenre("");
          setUpdateLanguage("");
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteBooks = (id, element) => {
    if (thisUser !== element.addedBy) {
      alert("not allowed!");
    } else if (!localStorage.getItem("token")) {
      alert("not allowed!");
    } else {
      axios
        .delete("http://localhost:5000/books/" + id, {
          headers: { token: localStorage.getItem("token") },
        })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          setUpdate(!update);
        })
        .catch((err) => console.log(err));
    }
  };

  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    setUser(null);
    setUpdate(!update);
    setEdit(null);
  };

  return (
    <div className="App mt-5">
      {thisUser && (
        <Button variant="outline-danger" onClick={(event) => logout(event)}>
          Logout
        </Button>
      )}

      {/*This is where all the TAB designing begins!*/}
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
        {/*-----------------------This is LOGIN PAGE tab---------------------------------------*/}
        {!thisUser && (
          <Tab eventKey="login" title="Login">
            <h1 className="m-5">Welcome!</h1>

            {/*This is LOGIN form*/}
            <Form onSubmit={(event) => login(event)} className="m-3">
              <Form.Group controlId="login">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="m-5">
                Submit
              </Button>
            </Form>
          </Tab>
        )}

        {/*----------------------------------This is HOME PAGE tab-----------------------------*/}
        <Tab eventKey="books" title="Home">
          <h1 className="m-5">Books</h1>
          <div className="mx-5">
            <Table striped bordered hover variant="outlined-light">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Language</th>
                </tr>
              </thead>
              <tbody>
                {books &&
                  books.map((element) => {
                    return (
                      <tr key={element.id}>
                        <td>{element.id}</td>
                        <td>{element.title}</td>
                        <td>{element.author}</td>
                        <td>{element.genre}</td>
                        <td>{element.language}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </Tab>

        {thisUser && (
          <Tab eventKey="myBooks" title="My Books">
            <h1 className="m-5">My Books</h1>
            <div className="mx-5">
              <Table striped bordered hover variant="outlined-light">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Language</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {books &&
                    books.map((element) => {
                      if (element.addedBy === thisUser) {
                        return (
                          <tr key={element.id}>
                            <td>{element.id}</td>
                            <td>{element.title}</td>
                            <td>{element.author}</td>
                            <td>{element.genre}</td>
                            <td>{element.language}</td>
                            <td>
                              <Button
                                variant="outline-warning"
                                onClick={() => setEdit(element)}
                              >
                                Edit
                              </Button>
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                onClick={() => deleteBooks(element.id, element)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </Table>
            </div>
          </Tab>
        )}

        {/*----------------------------------This is ADD BOOKS tab-----------------------------*/}

        {thisUser && (
          <Tab eventKey="addbooks" title="Add Books">
            <h1 className="m-5">Add Books</h1>

            {/* This is the card for adding books! */}
            <Card className="bg-light mx-auto" style={{ width: "30rem" }}>
              <Card.Header>Add Books</Card.Header>

              {/*This is the ADD BOOKS form in the card*/}
              <Form onSubmit={(event) => createBooks(event)} className="m-3">
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Insert Title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="author">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Insert Author"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="genre">
                  <Form.Label>Genre</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue="Choose..."
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  >
                    <option>Choose...</option>
                    <option>Action</option>
                    <option>Baby Books</option>
                    <option>Children</option>
                    <option>Crime</option>
                    <option>Drama</option>
                    <option>Fairytale</option>
                    <option>Fantasy</option>
                    <option>Horror</option>
                    <option>Mystery</option>
                    <option>Romance</option>
                    <option>Sci-fi</option>
                    <option>Thriller</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="language">
                  <Form.Label>Language</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue="Choose..."
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option>Choose...</option>
                    <option>English</option>
                    <option>Tamil</option>
                    <option>Malay</option>
                    <option>Chinese</option>
                    <option>French</option>
                    <option>Telugu</option>
                    <option>German</option>
                    <option>Spanish</option>
                  </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Add
                </Button>
              </Form>
            </Card>
          </Tab>
        )}

        {/* This is where we edit the book information */}
        {edit && thisUser && (
          <Tab
            eventKey="editbookinformation"
            title={"Edit Book Information: " + edit.id}
          >
            <h1 className="m-5">Edit book information</h1>

            {/* <div className="mx-5"> */}
            <Card className="bg-light mx-auto" style={{ width: "30rem" }}>
              <Card.Header>Edit Book information</Card.Header>
              <Form
                onSubmit={(event) => updateBooks(event, edit)}
                className="m-3"
              >
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateTitle || edit.title}
                    onChange={(event) => setUpdateTitle(event.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="author">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateAuthor || edit.author}
                    onChange={(event) => setUpdateAuthor(event.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="genre">
                  <Form.Label>Genre</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateGenre || edit.genre}
                    onChange={(event) => setUpdateGenre(event.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="language">
                  <Form.Label>Language</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateLanguage || edit.language}
                    onChange={(event) => setUpdateLanguage(event.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Form>
              <Button
                variant="warning"
                type="button"
                onClick={() => setEdit(null)}
              >
                Cancel Edit
              </Button>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}

export default App;
