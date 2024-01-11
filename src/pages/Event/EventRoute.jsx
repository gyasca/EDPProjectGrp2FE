import { useContext, useEffect, createContext, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import ViewEvents from './ViewEvents'
import ViewSpecificEvent from './ViewSpecificEvent'

export const CategoryContext = createContext(null);
export default function EventRouteAdmin() {
    const [activePage, setActivePage] = useState(null);

    return (
        <>
            <CategoryContext.Provider value={{activePage, setActivePage}}>
                <Routes>
                    <Route path="/" element={<ViewEvents />} />
                    <Route path="/:id" element={<ViewSpecificEvent />} />
                </Routes>
            </CategoryContext.Provider>
        </>
        
    )
}