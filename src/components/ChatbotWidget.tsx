import Script from 'next/script';

export default function ChatbotWidget() {
  return (
    <>
      <Script id="chatbase-config" strategy="afterInteractive">
        {`
          window.chatbaseConfig = {
            chatbotId: "8RfHP64djVLKsmEnWusKU"
          }
        `}
      </Script>
      <Script
        src="https://www.chatbase.co/embed.min.js"
        id="chatbase-script"
        strategy="afterInteractive"
      />
    </>
  );
} 