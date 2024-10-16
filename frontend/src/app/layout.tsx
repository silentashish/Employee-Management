import { Providers } from "./providers";
import type { Metadata } from "next";
import { fonts } from "./fonts";

export const metadata: Metadata = {
  title: "EarthStars",
  description: "Find perfect candidate for next project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body style={{ background: 'rgb(34, 37, 43)' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
