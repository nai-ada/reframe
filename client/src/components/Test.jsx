import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function Test() {
  // State for the user ID you want to query
  const [userId, setUserId] = useState("88ca4078-16aa-4fa1-b2f7-1a6ce367f503");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // You could add UI to change the user ID if needed
  const handleUserChange = (newId) => {
    setUserId(newId);
  };

  // Function to fetch entries for a specific user
  const fetchEntriesByUser = async (id) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", id);

      if (error) throw error;

      setEntries(data);
      console.log("Entries for user:", data);
    } catch (error) {
      console.error("Error fetching entries:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch entries when component mounts or userId changes
  useEffect(() => {
    fetchEntriesByUser(userId);
  }, [userId]);

  return (
    <div>
      <h2>Entries for User: {userId}</h2>

      {loading ? (
        <p>Loading entries...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <div>
          <div>
            <input
              type="text"
              value={userId}
              onChange={(e) => handleUserChange(e.target.value)}
              placeholder="Enter user ID"
            />
          </div>
          <p>Found {entries.length} entries</p>
          {entries.map((entry) => (
            <div
              key={entry.id}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ddd",
              }}
            >
              <p>
                <strong>User Content:</strong> {entry.user_content}
              </p>
              <p>
                <strong>Reframed Content:</strong> {entry.reframed_content}
              </p>
              <p>
                <strong>User Rating:</strong> {entry.user_rating}
              </p>
              <p>
                <strong>Reframe Rating:</strong> {entry.reframe_rating}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(entry.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Test;
