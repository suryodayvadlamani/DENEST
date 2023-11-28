import Header from "@components/Header/Header";
import "../../globals.css";
export const metadata = {
  title: "Denest",
  description: "HOstel Managment System",
};

export default async function RootLayout({ children }) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
    </>
  );
}
