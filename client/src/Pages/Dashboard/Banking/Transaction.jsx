import { useUpdateBalanceMutation } from "@/redux/features/allApis/usersApi/usersApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useFetchUser } from "../../../hooks/customHook";

const Transaction = ({ userId, availableBalance = 0 }) => {
  const { user, singleUser } = useSelector((state) => state.auth);
  const { fetchUser } = useFetchUser(user?._id);
  const [updateBalance] = useUpdateBalanceMutation();
  const [action, setAction] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransaction = async () => {
    if (!action) {
      toast.error("Please select deposit or withdraw");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (action === "withdraw" && availableBalance < Number(amount)) {
      toast.error("Insufficient balance");
      return;
    }
    if (action === "deposit" && singleUser?.balance < Number(amount)) {
      toast.error("Insufficient balance");
      return;
    }
    if (action === "deposit" && !singleUser?.balance) {
      toast.error("Insufficient balance");
      return;
    }
    const payload = {
      parentId: user?._id,
      userId,
      amount: Number(amount),
      type: action,
    };
    const result = await updateBalance(payload);
    if (result?.error) {
      toast.error(result.error);
    }
    if (result?.data.modifiedCount > 0) {
      toast.success(
        action === "deposit" ? "Deposit successful" : "Withdrawal successful"
      );
      fetchUser();
      setAmount("");
      setAction("");
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-row items-center justify-center">
        <button
          className={` px-1.5 py-0.5 border border-black text-white ${
            action === "deposit" ? "bg-green-500 scale-110" : "bg-blue-500"
          }`}
          onClick={() => setAction("deposit")}
        >
          D
        </button>
        <button
          className={` px-1.5 py-0.5 border border-black text-white ${
            action === "withdraw" ? "bg-green-500 scale-110" : "bg-yellow-700"
          }`}
          onClick={() => setAction("withdraw")}
        >
          W
        </button>
      </div>
      <input
        className="w-40 h-6 border border-black placeholder:text-xs sm:placeholder:text-sm px-4 py-2 outline-none"
        type="text"
        placeholder="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="w-8 h-6 px-1 border border-black text-black bg-yellow-400"
        onClick={handleTransaction}
      >
        Add
      </button>
    </div>
  );
};

export default Transaction;
