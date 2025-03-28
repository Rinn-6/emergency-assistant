"use client";
import { useState } from "react";
import axios from "axios";

export default function DetectEmergencyPage() {
    const backendUrl = process.env.NEXT_PUBLIC_TRIGGER_BACKEND_URL
    const [emergencyMessage, setEmergencyMessage] = useState<string>("");

    const sendEmergencyAlert = async () => {
        if (emergencyMessage.trim().toUpperCase() !== "HELP") {
            alert("Invalid input! You can only type 'HELP' to trigger an alert.");
            return;
        }

        try {
            await axios.post(`${backendUrl}/trigger_alert/`, { alert: "HELP" });
            alert("Emergency Alert Sent!");
            setEmergencyMessage("");
        } catch (error) {
            console.error("Error sending alert:", error);
        }
    };

    return (
        <div className="alert-page">
        <div className="alert-container">
            <h1 className="alert-title">Emergency Alert System</h1>
            <input
                className="alert-input"
                type="text"
                placeholder="Type HELP! "
                value={emergencyMessage}
                onChange={(e) => setEmergencyMessage(e.target.value)}
            />
            <button className="alert-btn" onClick={sendEmergencyAlert}>Send Alert</button>
        </div>
        </div>
    );
}
