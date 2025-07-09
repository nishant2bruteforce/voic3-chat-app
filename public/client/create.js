async function createServer() {
  const name = document.getElementById("serverName").value;

  if (!name) {
    alert("Please enter a server name.");
    return;
  }

  try {
    const response = await fetch('/api/servers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();
    alert(data.message);

    if (data.message === 'Server created') {
      // Save the server name to local storage (optional)
      localStorage.setItem('serverName', name);

      // Redirect to chat page
      window.location.href = 'chat.html';
    }
  } catch (error) {
    console.error("❌ Error creating server:", error);
    alert("Failed to create server. Try again.");
  }
}
