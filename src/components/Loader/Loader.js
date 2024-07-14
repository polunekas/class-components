import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Loader.module.css';
const Loader = () => {
    return (_jsx("div", { className: styles.loaderContainer, children: _jsx("div", { className: styles.loader }) }));
};
export default Loader;
