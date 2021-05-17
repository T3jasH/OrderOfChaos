import React from "react"

const LeaderboardHeader = () => {
    return (
        <div
            style={{
                display: "flex",
                width: "50%",
                margin: "auto",
                padding: "10px",
                backgroundColor: "steelblue",
                color: "white",
            }}
        >
            <div style={{ width: "300px" }}>Username</div>
            <div style={{ width: "300px" }}>Score</div>
            <div style={{ width: "300px" }}>Times attacked</div>
        </div>
    )
}

export default LeaderboardHeader
