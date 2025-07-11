async function handleUserInput() {
  const input = document.getElementById("user-input");
  const chat = document.getElementById("chat");
  const question = input.value.trim();
  if (!question) return;

  chat.innerHTML += `You: ${question}\n`;

  const res = await fetch("data.json");
  const data = await res.json();

  const matches = data.parts.filter(part =>
    part.keywords.some(k =>
      question.toLowerCase().includes(k.toLowerCase())
    )
  );

  if (matches.length > 0) {
    matches.forEach(part => {
      chat.innerHTML += `ValcoBot: ${part.id} — ${part.description}\n`;
    });
  } else {
    chat.innerHTML += "ValcoBot: Sorry, I couldn't find a match.\n";
  }

  input.value = "";
}
