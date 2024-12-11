import { compare, genSaltSync, hashSync } from 'bcryptjs-react';
import { collection, query, where, getDocs, addDoc, namedQuery } from 'firebase/firestore';
import { database } from '../firebaseConfig.js';

export const salt = genSaltSync(10);

async function getServerData(servers) {
    const usable_servers = [];
    let race_cond_manager = 0;
    for (const server of servers) {
        race_cond_manager++;
        const q_server = query(
            collection(database, "/Servers"),
            where("name", "==", server)
        );
        const snapshot = await getDocs(q_server)
        if (!snapshot.empty) {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name
            }));
            console.log(items[0]);
            usable_servers.push(items[0])  ;          
        }
    }
    // console.log("USABLE:", usable_servers);
    return usable_servers;
}

export const Authenticate = async ({login, setLogin}, servers) => {
    console.log(`[DEBUG] authenticated user ${login.username}`);
    setLogin({
      ...login,
      task: null,
      auth: true,
      servers: await getServerData(servers)
    });
  };

export const Deauthenticate = ({login, setLogin}) => {
    console.log(`[DEBUG] deauthenticated user ${login?.username}`);
    setLogin({
        username: '',
        password: '',
        task: null,
        auth: false,
        servers: []
      });
    };

//Create a new user in the database collection
export const Signup = async ({login, setLogin}) => {
    console.log(`[DEBUG] user ${login.username} is signing up`);
    const userCollection = collection(database, ("/Users"));
    const q_check = query(
        userCollection, 
        where("username", "==", login.username)
    );
    const snapshot = await getDocs(q_check);
    if (!snapshot.empty) {
        console.log(`[ERROR] user ${login.username} already exists`);
        Deauthenticate({login, setLogin});
        return;
    }

    await addDoc(userCollection, {
        "username": login.username,
        "password": hashSync(login.password, salt),
        "servers": []
    });
    console.log(`[DEBUG] user ${login.username} signed up successfully`);
    Login({login, setLogin});
};

//Check if user exists and if password matches to set the auth state (Authenticate)
export const Login = async ({login, setLogin}) => {
    console.log(`[DEBUG] user ${login.username} is logging in`);
    //find the user in the database
    const userCollection = collection(database, "Users");
    const q_login = query(
        userCollection,
        where("username", "==", login.username)
    );
    const snapshot = await getDocs(q_login);
    if (snapshot.empty) {
        console.log(`[ERROR] user ${login.username} does not exist`);
        Deauthenticate({login, setLogin});
        return;
    }
    //split the user data
    const userItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        userData: doc.data()
    }));

    if (userItems.length > 1) {
        console.log(`[ERROR] user ${login.username} has multiple entries`);
        Deauthenticate({login, setLogin});
        return;
    }
    //compare the password
    if(compare(login.password, userItems[0].userData.password)) {
        console.log(`[DEBUG] user ${login.username}  entered a matching password`);
        await Authenticate({login, setLogin}, userItems[0].userData.servers);
    } else {
        console.log(`[ERROR] user ${login.username} entered an incorrect password`);
        Deauthenticate({login, setLogin});
    }
};

// export const getServerId = (setServerId, name) => {
//     if (name == null) return;
//     const q_server = query(
//         collection(database, "/Servers"),
//         where("name", "==", name)
//     );
//     getDocs(q_server)
//         .then((snapshot) => {
//             if (snapshot.empty) {
//                 console.log(`[ERROR] no server exists of name: ${name}`);
//                 return;
//             }
//             const items = snapshot.docs.map((doc) => ({
//                 id: doc.id
//             }))[0];
//             setServerId(items.id);
//         })
//         .catch((e) => {
//             console.log(`[ERROR] problem in server ID retrieval: ${e}`)
//         });
//     return;
// }

export const getCategoriesFromServer = async (setCategoryData, server) => {
    if (server == null) return;
    const q_cat = query(
        collection(database, `/Servers/${server.id}/Categories`),
    );
    const snapshot = await getDocs(q_cat);
    if (snapshot.empty) {
        console.log(`[ERROR] no server exists of name: ${server.name}`);
        return;
    }
    const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name
    }));
    setCategoryData(items);
    return;
}

export const getChannelsFromCategory = async (setChannelData, setSelectedChannel, server, categoryData) => {
    if (categoryData == null) return;
    const data = [];
    for (const category of categoryData) {
        // console.log("\t\tFAOJWEOJFEWOF", category);
        // console.log(`\t\t/Servers/${server.id}/Categories/${category.id}/Channels`);
        const q_chan = query(
            collection(database, `/Servers/${server.id}/Categories/${category.id}/Channels`),
        );
        const snapshot = await getDocs(q_chan);
        if (snapshot.empty) {
            console.log(`[ERROR] no category exists of name: ${category.name}`);
            return;
        }
        const datum = {
            category: category,
            channels: []
        };
        const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name
        }));
        for (const item of items) {
            datum.channels.push(item);
        }
        data.push(datum);
    }
    // console.log("CHANNELS:", item);
    // console.log(items);
    setChannelData(data);
    const selectedChannel = {
        category: data[0].category,
        channel: data[0].channels[0]
    };
    setSelectedChannel(selectedChannel);
    return;
}

export const getMessagesFromChannel = async (setMessageData, server, channel) => {
    if ((server == null) || (channel == null)) return;
    const q_mesg = query(
        collection(database, `/Servers/${server.id}/Categories/${channel.category.id}/Channels/${channel.channel.id}/Messages`)
    );
    const snapshot = await getDocs(q_mesg);
    if (snapshot.empty) {
        console.log(`[ERROR] no no messages in channel: ${channel.channel.name}`);
        return;
    }
    const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        username: doc.data().username,
        text: doc.data().text
    }));
    setMessageData(items);
    return;
}
