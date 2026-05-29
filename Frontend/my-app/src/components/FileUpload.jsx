import React from "react";

import { useDropzone } from "react-dropzone";

import axios from "axios";

export default function FileUpload({
  refreshCustomers,
  refreshStats,
}) {

  const onDrop = async (acceptedFiles) => {

    const file = acceptedFiles[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {

      await axios.post(
        "http://localhost:8080/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("CSV Uploaded Successfully!");

      refreshCustomers();
      refreshStats();

    } catch (error) {

      console.log(error);

      alert("Upload Failed");

    }

  };

  const { getRootProps, getInputProps } =
    useDropzone({
      onDrop,
      accept: {
        "text/csv": [".csv"],
      },
    });

  return (

    <div
      {...getRootProps()}
      style={styles.dropzone}
    >

      <input {...getInputProps()} />

      <h2 style={styles.title}>
        Upload Telecom Dataset CSV
      </h2>

      <p style={styles.text}>
        Drag & drop CSV file here,
        or click to select file
      </p>

    </div>

  );

}

const styles = {

  dropzone: {

    border: "2px dashed #4f46e5",

    borderRadius: "20px",

    padding: "40px",

    textAlign: "center",

    background: "#fff",

    marginBottom: "40px",

    cursor: "pointer",

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.06)",

  },

  title: {

    marginBottom: "10px",

    color: "#111827",

  },

  text: {

    color: "#6b7280",

  },

};