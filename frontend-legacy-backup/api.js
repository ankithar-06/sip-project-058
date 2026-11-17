
const API_BASE_URL = "http://127.0.0.1:8000";

// Check whether the FastAPI backend is running
async function testBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Backend connected successfully:", data);
        return true;
    } catch (error) {
        console.error("Backend connection failed:", error.message);
        return false;
    }
}

// Get businesses saved in the database
async function getBusinesses() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/businesses/`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Could not load businesses:", error.message);
        return [];
    }
}

// Get products saved in the database
async function getProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Could not load products:", error.message);
        return [];
    }
}

function showMessage(container, message) {
    container.replaceChildren();
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    container.appendChild(paragraph);
}

function showCards(container, items, type) {
    container.replaceChildren();

    if (items.length === 0) {
        showMessage(container, `No ${type} found yet. Add one through the API docs.`);
        return;
    }

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "msme-data-card";

        const title = document.createElement("h3");
        title.textContent = item.name || "Unnamed";

        const details = document.createElement("p");

        if (type === "businesses") {
            details.textContent =
                `${item.category || "Other"} • ${item.location || "Location not provided"}`;
        } else {
            const price = item.price == null
                ? "Price not listed"
                : `₹${item.price}`;

            details.textContent =
                `${item.category || "General"} • ${price}`;
        }

        card.append(title, details);

        if (item.description) {
            const description = document.createElement("p");
            description.textContent = item.description;
            card.appendChild(description);
        }

        container.appendChild(card);
    });
}

async function loadDatabaseData() {
    const businessList = document.getElementById("business-list");
    const productList = document.getElementById("product-list");

    if (!businessList || !productList) {
        console.error("Live-data sections not found in index.html");
        return;
    }

    showMessage(businessList, "Loading businesses...");
    showMessage(productList, "Loading products...");

    const [businesses, products] = await Promise.all([
        getBusinesses(),
        getProducts()
    ]);

    showCards(businessList, businesses, "businesses");
    showCards(productList, products, "products");
}

loadDatabaseData();


// Run a basic connection test
testBackendConnection();
