import React, { createContext, useState, useEffect } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        const storedData = localStorage.getItem('RekogDataData');
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const results = data.filter(item =>
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredResults(results);
        } else {
            setFilteredResults([]);
        }
    }, [searchTerm, data]);

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, filteredResults }}>
            {children}
        </SearchContext.Provider>
    );
};
