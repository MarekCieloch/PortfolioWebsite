console.log("Fetch Api Loaded");

async function fetchAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error("Failed to fetch API data:", error);
    document.getElementById("apiData").textContent = `Error: ${error.message}`;
  }
}

function fetchCustomAPI() {
  const apiUrl = document.getElementById("apiInput").value;
  if (apiUrl.trim() === "") {
    alert("Please enter a valid API URL.");
    return;
  }
  fetchAPI(apiUrl);
}

function displayData(data) {
  const formattedData = formatData(data);
  document.getElementById("apiData").innerHTML = formattedData;
}

function formatData(data, indent = 0) {
  const indentation = "&nbsp;".repeat(indent * 4);
  if (typeof data === "object" && data !== null) {
    return Object.entries(data)
      .map(([key, value]) => {
        if (typeof value === "object") {
          return `${indentation}<b>${key}:</b><br>${formatData(
            value,
            indent + 1
          )}`;
        }
        return `${indentation}<b>${key}:</b> ${value}`;
      })
      .join("<br>");
  }
  return `${indentation}${data}`;
}
