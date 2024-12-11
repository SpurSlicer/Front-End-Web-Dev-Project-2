import React, { useEffect, useState } from 'react';
import ServersList from './components/ServersList';
import CategoriesList from './components/CategoriesList';
// import ChannelsList from './components/ChannelsList';
import ChatRoom from './components/Messages';
import WelcomeScreen from './components//WelcomeScreen';
import mockData from './assets/mockData';
import './index.css';
// import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { compare, genSaltSync, hashSync } from 'bcryptjs-react';
import { Signup, Login, salt, getCategoriesFromServer, getMessagesFromChannel, getChannelsFromCategory } from './auth';


function App() {
    const [selectedServer, setSelectedServer] = useState(null);
    // const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [login, setLogin] = useState({
        username: '',
        password: '',
        task: null,
        auth: false,
        servers: []
      }); 
    // const [serverData, setServerData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [messageData, setMessageData] = useState(null);

    // const [serverId, setServerId] = useState(null);
    // const [categoryId, setCategoryId] = useState(null);
    // const [channelId, setChannelId] = useState(null);
    // const [messageId, setMessageId] = useState(null);

  
    //an empty login object initialized
    //const [login, setLogin] = useState(null);

    //const mockData = mockData.servers[selectedServer];

    /* MANAGING SERVER NAME AND ID STUFF */
    // useEffect(() => {
    //     console.log('[DEBUG] set server id to:', serverId);
    //     getCategoriesFromServer(setCategoryData, serverId);
    // }, [serverId]);


    /* CATEGORY GENERATION */
    useEffect(() => {
        console.log(`[DEBUG] got this category data: ${categoryData}`);
        const fetchData = async () => { await getChannelsFromCategory(setChannelData, setSelectedChannel, selectedServer, categoryData); }
        fetchData();
    }, [categoryData]);

    useEffect(() => {
        console.log(`[DEBUG] got channel data: ${channelData}`);
        if (channelData == null) return;
        for (const channel of channelData) {
            console.log(`\t${JSON.stringify(channel)}`);
        }
        const fetchData = async () => { await getMessagesFromChannel(setMessageData, selectedServer, selectedChannel)}
        fetchData();
    }, [channelData]);

    useEffect(() => {
        console.log('[DEBUG] displaying messages:', messageData);
    }, [messageData]);
    
    useEffect(() => {
        console.log('[DEBUG] Changed server:', selectedServer);
        setCategoryData(null);
        setChannelData(null);
        setMessageData(null);
        const fetchData = async () => { await getCategoriesFromServer(setCategoryData, selectedServer); }
        fetchData();
    }, [selectedServer]);

    useEffect(() => {
        console.log('[DEBUG] Changed Channel:', selectedChannel);
        const fetchData = async () => { await getMessagesFromChannel(setMessageData, selectedServer, selectedChannel)}
        fetchData();
    }, [selectedChannel]);






    useEffect(() => {
        // console.log("SERVERS:", login.servers);
        if (login == null || !login.auth) {
            console.log('[DEBUG] User is not logged in');
        } else if (login.auth) {
            console.log(`[DEBUG] User ${login.username} is logged in`);
            if (login.servers.length > 0) {
                setSelectedServer(login.servers[0]);
            }
            return;
        }
        if (login.task == "login") { 
            const fetchData = async () => await Login({login, setLogin}); 
            fetchData();
        } else if (login.task == "signup") { Signup({login, setLogin}); }
        else if (login.task == null) { console.log('[DEBUG] No task'); }
        else { console.log(`[ERROR] Unknown task ${login.task}`); }
    } , [login]);

    return (
        <div className="app">
            {/* <h1>Can you see me</h1> */}
            {(login == null || !login.auth) ? (
                //<h1>Log In Please</h1>
                <WelcomeScreen login={login} setLogin={setLogin}/>
            ) : (
                <>
                    <ServersList
                        login={login}
                        servers={login.servers}
                        onSelectServer={(server) => {
                            setSelectedServer(server);
                            // setSelectedCategory(null);
                            setSelectedChannel(null);
                        }}
                    />
                    <CategoriesList
                        login={login}
                        server={selectedServer}
                        channels={channelData}
                        onSelectChannel={(category, channel) => {
                            console.log("\t\t\t\t", channel);
                            const new_channel = {
                                category: category.category,
                                channel: channel
                            }
                            setSelectedChannel(new_channel);
                        }}
                    />
                    <ChatRoom 
                        login={login}
                        messages={messageData} 
                    />
                </>
            )}
        </div>
    );
}

export default App;
