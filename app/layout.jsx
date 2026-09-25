// app/layout.jsx
import './globals.css';

export const metadata = {
  title: 'MBG: Road To School - Misi Antar 500 Porsi Gizi Mas Tion',
  description: 'Game side-scrolling 2D fisika tentang Mas Tion mengantar 500 porsi gizi hangat menuju SD, SMP, SMA Puspa Bangsa Cirebon didampingi Mang Abdul.',
  icons: {
    icon: '/assets/refresh/v11/sprites/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="w-full h-full relative bg-slate-950 text-white overflow-hidden select-none font-chakra">
        {children}
      </body>
    </html>
  );
}
