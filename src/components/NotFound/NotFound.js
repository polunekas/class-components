import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './NotFound.module.css';
const NotFound = () => {
    return (_jsxs("div", { className: styles.notFoundContainer, children: [_jsx("h1", { children: "404 - Page Not Found" }), _jsx("p", { children: "Sorry, the page you are looking for does not exist." })] }));
};
export default NotFound;
