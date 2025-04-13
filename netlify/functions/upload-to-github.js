// netlify/functions/upload-to-github.js

const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const token = process.env.GITHUB_TOKEN;
  const { path, fileName, fileContent } = JSON.parse(event.body);

  // ✅ تشفير المحتوى إلى base64
  const encodedContent = Buffer.from(fileContent, "utf-8").toString("base64");

  const githubApiUrl = `https://api.github.com/repos/linnkou/majani/contents/${path}/${fileName}`;

  const res = await fetch(githubApiUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "netlify-uploader"
    },
    body: JSON.stringify({
      message: `رفع الملف ${fileName} من الواجهة`,
      content: encodedContent
    })
  });

  const data = await res.json();

  return {
    statusCode: res.status,
    body: JSON.stringify(data)
  };
};
