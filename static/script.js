function detectSpam() {
    const message = document.getElementById("message").value;
    const resultDiv = document.getElementById("result");

    if (message.trim() === "") {
        resultDiv.innerHTML = "Please enter a message first.";
        resultDiv.className = "warning";
        return;
    }

    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        let keywordText = "";

        if (data.keywords.length > 0) {
            keywordText = `<p>Suspicious keywords: ${data.keywords.join(", ")}</p>`;
        } else {
            keywordText = `<p>No obvious suspicious keywords found.</p>`;
        }

        if (data.prediction === "spam") {
            resultDiv.innerHTML = `
                <h3>🚨 Spam Message Detected!</h3>
                <p>Confidence: ${data.confidence}%</p>
                ${keywordText}
            `;
            resultDiv.className = "spam";
        } else {
            resultDiv.innerHTML = `
                <h3>✅ Safe Message</h3>
                <p>Confidence: ${data.confidence}%</p>
                ${keywordText}
            `;
            resultDiv.className = "safe";
        }
    })
    .catch(error => {
        resultDiv.innerHTML = "Something went wrong.";
        resultDiv.className = "warning";
        console.error(error);
    });
}

function useSpamExample() {
    document.getElementById("message").value =
        "Congratulations! You have won a free cash prize. Click here to claim now!";
}

function useSafeExample() {
    document.getElementById("message").value =
        "Hi, are we still meeting tomorrow at the university?";
}