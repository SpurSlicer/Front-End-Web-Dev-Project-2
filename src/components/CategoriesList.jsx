import React, { useEffect, useState } from 'react';
import { getChannelsFromCategory } from '../auth';


function CategoriesList({ login, server, categories, channels, onSelectChannel }) {


    const generateServers = () => {
        // console.log(channels);
        const final_channels = [];
        for (const category of channels) {
            final_channels.push(
                <h4 key={category.category.id}>
                    {category.category.name}
                </h4>
            )
            for (const channel of category.channels) {
                final_channels.push(
                    <button key={channel.id} onClick={() => onSelectChannel(category, channel)}>
                        {channel.name}
                    </button>            
                );
            }
        }
        return final_channels;
    }

    return (
        <div className="categories-list">
            <h3>Categories</h3>
            {(channels == null) ? <h4>No categories here!</h4> : generateServers()}
        </div>
    );
}

export default CategoriesList;
