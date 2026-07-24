import { useDispatch } from "react-redux";
import { getRandomBg } from "../../utils";
import { useNavigate } from "react-router-dom";
import { updateTable } from "../../features/customerSlice";

const TableCard = ({ name, status, initial, seats }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleTableClick = () => {
    if(status === 'Booked') return;
    dispatch(updateTable({tableNo: name}))
    navigate('/menu')
  }
  return (
    <div onClick={handleTableClick} className="w-[300px] bg-[#2a2a2a] p-4 rounded-lg my-4 cursor-pointer">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
          {name}
        </h1>
        <p
          className={`px-2 py-1 rounded ${status === "Booked" ? "bg-green-300 text-green-600" : "bg-[#664104] text-white"}`}
        >
          {status}
        </p>
      </div>
      <div className="flex justify-center items-center my-5">
        <h1 className={`${getRandomBg()} rounded-full text-white p-5 text-xl`}>
          {initial}
        </h1>
      </div>
      <p className="text-[#ababab] text-sm ">
        {seats} seats
      </p>
    </div>
  );
};

export default TableCard;
