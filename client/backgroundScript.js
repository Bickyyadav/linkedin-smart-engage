async function generateComment(tone, postContent) {

  const suggestion = await fetch("http://localhost:8000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tone, postContent }),
  });

  const data = await suggestion.json();
  return data.comment;
}
