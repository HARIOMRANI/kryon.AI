import "./globals.css";

export const metadata = {
  title: "Kryon AI Agent",
  description: "Your Personal AI Video Agent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

