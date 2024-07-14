import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import styles from './ErrorBoundary.module.css';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.handleReload = () => {
            this.setState({ hasError: false });
            window.location.reload();
        };
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: styles.errorWrapper, children: [_jsx("h1", { children: "Something went wrong." }), _jsx("button", { className: styles.reloadButton, onClick: this.handleReload, children: "Reload" })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
