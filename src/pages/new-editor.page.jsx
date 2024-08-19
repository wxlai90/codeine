import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Import the spinner component
import { db } from "../firebase";

const NewEditorPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const createNewDoc = async () => {
      try {
        // Create a new Firestore document
        const docRef = await addDoc(collection(db, "sessions"), {
          code: "// Write your code here",
          language: "c",
        });

        // Redirect to the newly created document ID
        navigate(`${docRef.id}`);
      } catch (e) {
        console.error("Error adding document: ", e);
      } finally {
        setLoading(false); // Ensure loading is set to false in case of error
      }
    };

    createNewDoc();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {loading ? (
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default NewEditorPage;
