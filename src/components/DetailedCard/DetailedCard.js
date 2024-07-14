import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './DetailedCard.module.css';
const DetailedCard = ({ pokemon, onClose }) => {
    if (!pokemon)
        return null;
    return (_jsxs("div", { className: styles.detailedCard, children: [_jsx("button", { onClick: onClose, className: styles.closeButton, children: "Close" }), _jsx("h2", { children: pokemon.name[0].toUpperCase() + pokemon.name.slice(1) }), _jsxs("p", { children: ["Height: ", pokemon.height] }), _jsxs("p", { children: ["Weight: ", pokemon.weight] }), _jsxs("p", { children: ["Abilities: ", pokemon.abilities] }), _jsxs("p", { children: ["Types: ", pokemon.types] })] }));
};
export default DetailedCard;
