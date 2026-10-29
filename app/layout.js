import "./globals.css";

export const metadata = {
  title: "EnerVue EMS",
  description: "Energy Management Platform — local, cloud or hybrid.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
