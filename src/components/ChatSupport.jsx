import { useEffect } from 'react';

const ChatSupport = () => {
    useEffect(() => {
        const propertyId = '65b91a7c0ff74c6d328c7075';
        const widgetId = '1hkplb89k';

        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        })();

        console.log("Chat Support (Tawk.to) script injected.");
    }, []);

    return null; // This component doesn't render any UI
};

export default ChatSupport;
