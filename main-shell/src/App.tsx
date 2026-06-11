import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
