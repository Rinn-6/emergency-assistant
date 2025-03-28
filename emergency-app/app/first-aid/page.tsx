"use client";
import { useState } from "react";
import axios from "axios";

interface FirstAidResponse {
    first_aid?: string;
}

export default function HomePage() {
    const backendUrl = process.env.NEXT_PUBLIC_FIRST_AID_BACKEND_URL;
    const [emergencyType, setEmergencyType] = useState<string>("");
    const [firstAid, setFirstAid] = useState<string>("Waiting for instructions...");
    const [loadingFirstAid, setLoadingFirstAid] = useState<boolean>(false);

    const getFirstAidInstructions = async () => {
        if (!emergencyType.trim()) {
            alert("Please enter an emergency type.");
            return;
        }

        setLoadingFirstAid(true);
        setFirstAid("Fetching first aid instructions...");

        try {
            const response = await axios.post<FirstAidResponse>(
                `${backendUrl}/first_aid_guide/`,
                { emergency_type: emergencyType },
                { headers: { "Content-Type": "application/json" } }
            );

            setFirstAid(response.data.first_aid ?? "No instructions available.");
        } catch (error) {
            console.error("Error fetching first aid instructions:", error);
            setFirstAid("Error fetching instructions. Try again.");
        } finally {
            setLoadingFirstAid(false);
        }
    };

    return (
        <div className="first-aid-page">
            <div className="first-aid-container">
                <h1 className="first-aid-title">AI-Powered First-Aid-Guide</h1>
                
                
                <div className="first-aid-input-container">
                    <input
                        className="first-aid-input"
                        type="text"
                        placeholder="Enter emergency type (e.g., heart attack, choking)"
                        value={emergencyType}
                        onChange={(e) => setEmergencyType(e.target.value)}
                    />
                    <button className="first-aid-btn" onClick={getFirstAidInstructions} disabled={loadingFirstAid}>
                        {loadingFirstAid ? "Fetching..." : "Get First Aid Guide"}
                    </button>
                </div>

            
                <div className="first-aid-response">
                    <p className="first-aid-text">
                        <strong>First Aid:</strong> {firstAid}
                    </p>
                </div>
            </div>
        </div>
    );
}
