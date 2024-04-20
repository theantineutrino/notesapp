import axios from "axios";
import { useState, useEffect } from "react";
export default function Notes() {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://notesapp-2hyf.onrender.com/api/v1/notes/",
        {
          withCredentials: true,
        }
      );
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      Wello
      <ul>
        {data.map((note) => (
          <li key={note._id}>{note.title}</li>
        ))}
      </ul>
    </div>
  );
}
