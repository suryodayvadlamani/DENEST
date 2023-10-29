import { Input } from "@UI/input";
import { Button } from "@UI/button";
import { BsSearch } from "react-icons/bs";
import AddTenant from "@components/User/AddTenant";
export default function Hostels() {
  return (
    <section className="bg-black flex-grow">
      <div
        className="flex max-w-sm mx-10 my-5 items-center space-x-2 border-input border
       rounded-md 
       ring-offset-background
       focus-within:outline-none
        focus-within:ring-2 
        focus-within:ring-ring 
        focus-within:ring-offset-2"
      >
        <BsSearch className="mx-2" />
        <Input
          type="email"
          placeholder="Search...."
          variant="ghost"
          id="globalSearch"
          className="border-0 hover:border-0 pl-0 bg-transparent"
        />
      </div>
      <div className="flex flex-row gap-5 ml-10">
        <Button variant="ghost" className="text-gray-300 bg-slate-500">
          Total Hostels 4
        </Button>
        <Button variant="outline">+Add Hostel</Button>
      </div>
      <AddTenant />
    </section>
  );
}
