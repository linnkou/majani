// netlify/functions/upload-to-github.js

const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const token = process.env.GITHUB_TOKEN; // أخفي التوكن في إعدادات Netlify
  const { path, fileName, fileContent } = JSON.parse(event.body);

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
      content: fileContent  // يجب أن يكون base64
    })
  });

  const data = await res.json();

  return {
    statusCode: res.status,
    body: JSON.stringify(data)
  };
};
