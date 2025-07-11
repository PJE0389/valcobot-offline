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
async function handleUserInput() {
  const input = document.getElementById("user-input");
  const chat = document.getElementById("chat");
  const question = input.value.trim();
  if (!question) return;

  chat.innerHTML += `You: ${question}\n`;

  const res = await fetch("data.json");
  const data = await res.json();

  // Simple fuzzy matching function
  // Checks if all characters of 'query' are found in 'str' in order
  const fuzzyMatch = (str, query) => {
    str = str.toLowerCase();
    query = query.toLowerCase();
    let i = 0, j = 0; // i for query, j for str
    while (i < query.length && j < str.length) {
      if (query[i] === str[j]) {
        i++;
      }
      j++;
    }
    return i === query.length; // True if all query characters were found in order
  };

  const matches = data.parts.filter(part => {
    // Try to match the full question against the description and keywords
    if (fuzzyMatch(part.description, question)) {
      return true;
    }
    if (part.keywords.some(k => fuzzyMatch(k, question) || fuzzyMatch(question, k))) {
      return true;
    }

    // Additionally, try to match individual words from the question
    // This allows for "stiffener .25" to match even if "stiffener for .25 tubing" is the description
    const questionWords = question.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const partRelevantStrings = [part.description.toLowerCase(), ...part.keywords.map(k => k.toLowerCase())];

    return questionWords.every(qWord =>
      partRelevantStrings.some(pString => fuzzyMatch(pString, qWord) || fuzzyMatch(qWord, pString))
    );
  });

  if (matches.length > 0) {
    matches.forEach(part => {
      chat.innerHTML += `ValcoBot: ${part.id} — ${part.description}\n`;
    });
  } else {
    chat.innerHTML += "ValcoBot: Sorry, I couldn't find a match. Please try rephrasing or providing more details.\n";
  }

  input.value = "";
}
