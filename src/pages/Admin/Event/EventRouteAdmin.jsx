import { useContext, useEffect, createContext, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import ViewEvents from './ViewEvents'
import AddEvent from './AddEvent'
import EditEvent from './EditEvent'

export const CategoryContext = createContext(null);
export default function EventRouteAdmin() {
    const [activePage, setActivePage] = useState(null);

    return (
        <>
            <CategoryContext.Provider value={{activePage, setActivePage}}>
                <Routes>
                    <Route path="/" element={<ViewEvents />} />
                    <Route path="/add" element={<AddEvent />} />
                    <Route path="/edit/:id" element={<EditEvent />} />
                </Routes>
            </CategoryContext.Provider>
        </>
        
    )
}