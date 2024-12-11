import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '/firebaseConfig';
import { mockData } from '../assets/mockDatajs';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'


function ServersList({ login, servers, onSelectServer }) {
    // const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        console.log("SERVERS:", servers);
    }, []);

    // console.log("SERVERS:", servers);

    // useEffect(() => {
    //     const fetchServers = async () => {
    //         if (selectedServer == null) return;
    //         const q = query(
    //             collection(database, "Servers"),
    //             where("name", "==", "selectedServer")
    //         );
    //         const snapshot = await getDocs(q);
    //         if (snapshot.empty) {
    //             console.log(`[ERROR] server name ${selectedServer} dne!`);
    //             return;
    //         }
    //     };

    //     fetchServers();
    //     setLoading(false);
    // }, []);

    // if (loading) {
    //     return <div>Loading servers...</div>;
    // }

    const generateServers = () => {
        const final_servers = [];
        for (const server of servers) {
            final_servers.push(
                <button key={server.id} onClick={() => onSelectServer(server)}>
                    {server.name}
                </button>            
            )
        }
        return final_servers;
    }

    return (
        <div className="servers-list">
            <h3>Servers</h3>
            {Object.entries(servers).length == 0 ? (
                <p>No servers available</p>
            ) : ( generateServers() )}
        </div>
    );
}

export default ServersList;
