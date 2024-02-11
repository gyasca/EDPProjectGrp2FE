// User authentication
import { jwtDecode } from "jwt-decode";

export function validateAdmin() {
    try {
        console.log("Validating admin status in user.js");
        const token = localStorage.getItem('accessToken');
        const decoded = jwtDecode(token);
        // console.log("decoded token", decoded);
        if (decoded.role == "employee-normal" || decoded.role == "employee-master") {
            console.log("Admin status validated in user.js successful");
            return true;
        }
        console.log("Admin status validated in user.js unsuccessful");
        return false;
    } catch {
        return false;
    }
}

export function validateUser() {
    try {
        const token = localStorage.getItem('accessToken');
        const decoded = jwtDecode(token);
        return true;
    } catch {
        return false;
    }
}