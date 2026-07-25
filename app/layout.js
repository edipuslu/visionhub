import "./globals.css";

export const metadata = {
  title: "VisionHub - Uslu Digital",
  description: "Your creative projects, beautifully organized.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
