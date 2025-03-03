import {} from "./utils/apiCall";
import Cabinet from "./Cabinet";
import Login from "./Login";
import Register from "./Register";
import VideoModal from "./AddLesson";
import { Routes, Route, Link } from "react-router-dom";
const App = () => {
  const a = localStorage.getItem("id");
  console.log(a);

  return (
    <div>
      <div className="text-white d-flex justify-content-between p-3 bg-dark align-items-center">
        <Link
          style={{
            textDecoration: "none",
            fontSize: "38px",
            fontFamily: "monospace",
          }}
          className="text-white"
          to={`/addVideo/${a}`}
        >
          Logo
        </Link>
        <div className="d-flex gap-2 align-item-center justify-content-center">
          <Link to={"/"} className="btn btn-primary btn-sm m-2">
            Login
          </Link>
          <Link to={"/cabinet"} className="btn btn-warning btn-sm m-2">
            Cabinet
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addVideo/:id" element={<VideoModal />} />
        <Route path="/cabinet" element={<Cabinet />} />
      </Routes>
    </div>
  );
};

export default App;
