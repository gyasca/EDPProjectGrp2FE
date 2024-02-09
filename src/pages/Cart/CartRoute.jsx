import { useContext, useEffect, createContext, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { ViewCart } from './Cart';

export const CategoryContext = createContext(null);
export default function CartRoute() {
    const [activePage, setActivePage] = useState(null);

    return (
        <>
            <CategoryContext.Provider value={{activePage, setActivePage}}>
                <Routes>
                    <Route path="/" element={<ViewCart />} />
                </Routes>
            </CategoryContext.Provider>
        </>
        
    )
}