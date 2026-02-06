import { useEffect } from 'react';

const ChatSupport = () => {
    useEffect(() => {
        const propertyId = '6985c55f3bf2001c328dbf1e';
        const widgetId = '1jgp8m0bk';

        // Delay script injection to prioritize main content
        const timer = setTimeout(() => {
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_LoadStart = new Date();
            (function () {
                var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
                s1.charset = 'UTF-8';
                s1.setAttribute('crossorigin', '*');
                s0.parentNode.insertBefore(s1, s0);
            })();
            console.log("Chat Support (Tawk.to) script injected after delay.");
        }, 3000);

        // Click outside to minimize logic
        const handleDocumentClick = () => {
            if (window.Tawk_API && typeof window.Tawk_API.minimize === 'function') {
                if (typeof window.Tawk_API.isChatMaximized === 'function' && window.Tawk_API.isChatMaximized()) {
                    window.Tawk_API.minimize();
                }
            }
        };

        window.addEventListener('click', handleDocumentClick);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return null; // This component doesn't render any UI
};

export default ChatSupport;
