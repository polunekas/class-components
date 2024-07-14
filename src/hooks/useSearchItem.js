import { useState, useEffect } from 'react';
const useSearchItem = () => {
    const [searchItem, setSearchItem] = useState(() => localStorage.getItem('searchItem') || '');
    useEffect(() => {
        return () => {
            localStorage.setItem('searchItem', searchItem);
        };
    }, [searchItem]);
    return [searchItem, setSearchItem];
};
export default useSearchItem;
