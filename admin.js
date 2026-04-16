// simple password (still basic, better than before)
const pass = prompt("Enter Admin Password");

if (pass !== "admin123") {
    document.body.innerHTML = "<h1>Access Denied</h1>";
}

// ========================
// ADD ANNOUNCEMENT
// ========================
async function addAnnouncement() {
    const text = document.getElementById("announcement").value;

    if (!text) return alert("Enter announcement");

    try {
        await fetch("http://localhost:3000/announcements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        document.getElementById("announcement").value = "";
        loadAnnouncements();
    } catch {
        alert("Error adding announcement");
    }
}

// ========================
// LOAD ANNOUNCEMENTS
// ========================
async function loadAnnouncements() {
    try {
        const res = await fetch("http://localhost:3000/announcements");
        const data = await res.json();

        const list = document.getElementById("list");
        list.innerHTML = "";

        data.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.text} 
                <button onclick="deleteAnnouncement(${item.id})">❌</button>
            `;
            list.appendChild(li);
        });
    } catch {
        alert("Error loading announcements");
    }
}

// DELETE
async function deleteAnnouncement(id) {
    await fetch(`http://localhost:3000/announcements/${id}`, {
        method: "DELETE"
    });
    loadAnnouncements();
}

// ========================
// LOAD ENQUIRIES
// ========================
async function loadEnquiries() {
    try {
        const res = await fetch("http://localhost:3000/enquiries");
        const data = await res.json();

        const list = document.getElementById("enquiries");
        list.innerHTML = "";

        data.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.parent_name} | ${item.phone} | ${item.student_name}`;
            list.appendChild(li);
        });
    } catch {
        alert("Error loading enquiries");
    }
}

// INIT
loadAnnouncements();
loadEnquiries();