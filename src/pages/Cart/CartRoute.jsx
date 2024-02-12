import { useContext, useEffect, createContext, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { ViewCart } from './Cart';
import { CheckoutSummary } from './CheckoutSummary';

export const CategoryContext = createContext(null);
export default function CartRoute() {
    const [activePage, setActivePage] = useState(null);

    return (
        <>
            <CategoryContext.Provider value={{activePage, setActivePage}}>
                <Routes>
                    <Route path="/" element={<ViewCart />} />
                    <Route path="/checkout/:orderId" element={<CheckoutSummary />} />
                </Routes>
            </CategoryContext.Provider>
        </>
        
    )
}