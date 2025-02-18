import { useState, useEffect } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { apicall } from "./utils/apiCall";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}
interface Field {
  Videotheme: string;
  url: string;
}

interface Video {
  id: string;
  theme: string;
  fields: Field[];
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isOpens, setIsOpens] = useState(false);
  const [watchedId, setWatchedId] = useState<string | null>(null);

  useEffect(() => {
    apicall("/user", "GET", "").then((res) => setUsers(res.data));
  }, []);

  function onSelectUser(id: string) {
    setSelectedUserId(id);
    apicall(`/video?userId=${id}`, "GET", "").then((res) =>
      setVideos(res.data)
    );
  }

  function watch(id: string) {
    setWatchedId(id);
    setIsOpens(true);
  }

  return (
    <div className="d-flex">
      <div className="user-list mt-2 border vh-100 w-25">
        {users.map((user) => (
          <div
            key={user.id}
            className="border w-100 p-2"
            onClick={() => onSelectUser(user.id)}
          >
            {user.name}
          </div>
        ))}
      </div>
      <div className="w-75 mt-2">
        <div className="border vh-100 p-3 d-flex flex-wrap gap-3">
          {selectedUserId ? (
            videos.length > 0 ? (
              videos.map((itm, i) => (
                <div
                  key={i}
                  className="card text-center shadow-sm border rounded p-3"
                  style={{ width: "200px", height: "200px" }}
                >
                  <div className="card-body">
                    <p
                      style={{ fontSize: "12px" }}
                      className="card-title fw-semibold"
                    >
                      In this lesson
                      <span className="text-danger">{itm.fields.length}</span>
                      videos
                    </p>
                    <h4>{itm.theme}</h4>
                    <button
                      style={{ fontSize: "12px" }}
                      className="btn btn-link text-primary text-decoration-none"
                      onClick={() => watch(itm.id)}
                    >
                      Watch video
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <h4>No videos available for this user.</h4>
            )
          ) : (
            <h1>Select a user to view videos</h1>
          )}
        </div>
      </div>
      <Rodal visible={isOpens} onClose={() => setIsOpens(false)}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Theme</th>
              <th>Url</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((item) =>
              item.id === watchedId
                ? item.fields.map((field, index) => (
                    <tr key={item.id + index}>
                      <td>{field.Videotheme}</td>
                      <td>
                        <a
                          href={field.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {field.url}
                        </a>
                      </td>
                    </tr>
                  ))
                : null
            )}
          </tbody>
        </table>
      </Rodal>
    </div>
  );
};

export default UserList;
