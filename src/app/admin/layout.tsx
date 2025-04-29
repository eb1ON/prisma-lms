export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className="bg-[#0f181e] text-white">{children}</body>
    </html>
  );
}
