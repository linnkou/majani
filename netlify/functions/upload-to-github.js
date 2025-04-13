import React, { useState } from "react";

const UploadToGitHub = () => {
  const [file, setFile] = useState(null);
  const [path, setPath] = useState("educationdzwordland");
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("يرجى اختيار ملف");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const fileContent = atob(btoa(reader.result)); // إعادة التشفير في الدالة
      const response = await fetch("/.netlify/functions/upload-to-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          fileName: file.name,
          fileContent
        })
      });

      const data = await response.json();
      setResult(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div dir="rtl" style={{ fontFamily: "sans-serif" }}>
      <h2>📤 رفع ملف إلى GitHub</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="المسار داخل GitHub (مثال: educationdzwordland/الطور المتوسط)"
        value={path}
        onChange={(e) => setPath(e.target.value)}
      />
      <button onClick={handleUpload}>رفع</button>

      {result && (
        <pre style={{ background: "#f0f0f0", padding: "1em" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default UploadToGitHub;
