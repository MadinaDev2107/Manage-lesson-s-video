import Rodal from "rodal";
import { useForm } from "react-hook-form";
import "rodal/lib/rodal.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { apicall } from "./utils/apiCall";

interface Field {
  Videotheme: string;
  url: string;
}
interface Post {
  id: string;
  userId: string;
  theme: string;
  fields: Field[];
}
const AddLesson = () => {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [watchedId, setWatchedId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpens, setIsOpens] = useState(false);
  const { handleSubmit, reset, register } = useForm();
  const [fields, setFields] = useState<Field[]>([]);
  const [theme, setTheme] = useState("");
  const [src, setSrc] = useState<Post[]>([]);
  const { id } = useParams();

  const addField = () => {
    const obj = { Videotheme: "", url: "" };
    setFields([...fields, obj]);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleChange = (index: number, key: keyof Field, value: string) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  function modal() {
    setIsOpen(false);
    setFields([]);
    setTheme("");
    reset({ theme: "", fields: [] });
  }

  function saveUser() {
    const obj = { userId: id, theme, fields };
    if (currentId) {
      apicall(`/video/${currentId}`, "PUT", obj).then(() => hello());
      setCurrentId(null);
    } else {
      apicall("/video", "POST", obj).then(() => hello());
    }
    setIsOpen(false);
    reset({ theme: "", fields: [] });
  }

  function onDelete(lessonId: string) {
    apicall(`/video/${lessonId}`, "DELETE", "").then(() => {
      setSrc(src.filter((item) => item.id !== lessonId));
    });
  }

  function hello() {
    apicall(`/video?userId=${id}`, "GET", "").then((res) => {
      setSrc(res.data);
    });
  }

  function params(lessonId: string) {
    setCurrentId(lessonId);
    setIsOpen(true);
    apicall(`/video/${lessonId}`, "GET", "").then((res) => {
      reset({ theme: res.data.theme, fields: res.data.fields });
      setFields(res.data.fields);
    });
  }

  function watch(id: string) {
    setWatchedId(id);
    setIsOpens(true);
  }

  return (
    <>
      <div className=" d-flex justify-content-around m-3 gap-5">
        <button
          className=" btn btn-success shadow"
          onClick={() => setIsOpen(true)}
        >
          +
        </button>
      </div>
      <div>
        <div className="d-flex gap-1 flex-wrap w-50">
          {src.map((itm, i) => {
            return (
              <div
                key={i}
                className="card text-center shadow-sm border rounded p-3"
                style={{ width: "200px", height: "200px" }}
              >
                <div onDoubleClick={() => params(itm.id)} className="card-body">
                  <p
                    style={{ fontSize: "12px" }}
                    className="card-title fw-semibold "
                  >
                    In this lesson
                    <span className="text-danger"> {itm.fields.length} </span>
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
                  <button
                    style={{ fontSize: "12px", width: "100px" }}
                    className="btn btn-danger mt-1 sm-2"
                    onClick={() => onDelete(itm.id)}
                  >
                    Delete lesson
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Rodal visible={isOpen} onClose={modal}>
        <form onSubmit={handleSubmit(saveUser)}>
          <input
            {...register("theme", { required: true })}
            style={{ width: "320px", fontSize: "14px", height: "30px" }}
            type="text"
            placeholder="Theme......"
            className="form-control mb-2 small-input"
            onChange={(e) => setTheme(e.target.value)}
          />
          <div style={{ height: "130px" }} className="overflow-auto">
            {fields.map((field, index) => (
              <div
                key={index}
                className="mb-1 d-flex justify-content-around gap-2"
              >
                <input
                  {...register(`fields.${index}.Videotheme`, {
                    required: true,
                  })}
                  type="text"
                  placeholder="Theme....."
                  style={{ width: "120px", fontSize: "14px", height: "30px" }}
                  className="form-control mb-1 w-50 small-input"
                  value={field.Videotheme}
                  onChange={(e) =>
                    handleChange(index, "Videotheme", e.target.value)
                  }
                />
                <input
                  {...register(`fields.${index}.url`, { required: true })}
                  type="text"
                  style={{ width: "120px", fontSize: "14px", height: "30px" }}
                  placeholder="url...."
                  className="form-control mb-1 w-50"
                  value={field.url}
                  onChange={(e) => handleChange(index, "url", e.target.value)}
                />
                <button
                  type="button"
                  style={{ width: "30px", fontSize: "14px", height: "30px" }}
                  className="btn btn-danger btn-sm"
                  onClick={() => removeField(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-warning mt-2"
              onClick={addField}
            >
              Add Video
            </button>
            <button type="submit" className="btn btn-primary mt-2">
              Save
            </button>
          </div>
        </form>
      </Rodal>
      <Rodal visible={isOpens} onClose={() => setIsOpens(false)}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Theme</th>
              <th>Url</th>
            </tr>
          </thead>
          <tbody>
            {src.map((item) =>
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
    </>
  );
};

export default AddLesson;
