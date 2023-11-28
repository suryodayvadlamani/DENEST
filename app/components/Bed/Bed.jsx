import { BiSolidBed } from "react-icons/bi";
import BedMenu from "@components/Bed/BedMenu";
const Bed = ({ bedData }) => {
  const { id, title, occupied } = bedData;
  return (
    <div key={id} className="flex flex-col items-center text-center text-xs   ">
      {occupied ? (
        <BiSolidBed className="text-2xl lg:text-3xl text-primary" />
      ) : (
        <BedMenu bedId={id} />
      )}
      {title}
    </div>
  );
};

export default Bed;
