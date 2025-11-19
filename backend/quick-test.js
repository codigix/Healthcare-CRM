const http = require("http");

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:5000/api${path}`);
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const response = {
            status: res.statusCode,
            body: body ? JSON.parse(body) : null,
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            body,
          });
        }
      });
    });

    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  try {
    console.log("Testing Health Endpoint...");
    const healthRes = await makeRequest("GET", "/health");
    console.log("Health Status:", healthRes.status, healthRes.body);

    console.log("\nTesting Login...");
    const loginRes = await makeRequest("POST", "/auth/login", {
      email: "admin@medixpro.com",
      password: "password123",
    });
    console.log("Login Status:", loginRes.status);
    console.log("Login Response:", loginRes.body);

    if (loginRes.body && loginRes.body.token) {
      const token = loginRes.body.token;
      console.log(
        "\n✓ Login Successful! Token:",
        token.substring(0, 50) + "..."
      );

      console.log("\nTesting Medicines API...");
      const url = new URL("${API_URL}/medicines?page=1&limit=10");
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const medicinesRes = await new Promise((resolve, reject) => {
        const req = http.request(url, options, (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              resolve({
                status: res.statusCode,
                body: JSON.parse(body),
              });
            } catch (e) {
              resolve({
                status: res.statusCode,
                body,
              });
            }
          });
        });
        req.on("error", reject);
        req.end();
      });

      console.log("Medicines Status:", medicinesRes.status);
      console.log("Medicines Count:", medicinesRes.body.total);
      console.log("✓ API working successfully!");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
  process.exit(0);
}

runTests();
