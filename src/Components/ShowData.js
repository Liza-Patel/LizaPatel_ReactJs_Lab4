import { useEffect, useState } from "react";
import { getDataFromServer } from "../services/menu";
import ExpenseTracker from "./ExpenseTracker";

function ShowData() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [sum, setSum] = useState(0); 
  const [rahulspent, setRahulspent] = useState(0);
  const [rameshspent, setRameshspent] = useState(0);
  const [showform, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getDataFromServer();
        setItems(data);
        calculateSumAndShares(data);
      } catch (error) {
        setError(error);
      }
    };
    fetchMenu();
  }, [showform]);

  const calculateSumAndShares = (data) => {
    let totalSum = 0;
    let rahulSum = 0;
    let rameshSum = 0;

    data.forEach((item) => {
      const price = Number(item.price) || 0; // Ensure price is a number
      totalSum += price;
      if (item.payeeName === "Rahul") {
        rahulSum += price;
      } else if (item.payeeName === "Ramesh") {
        rameshSum += price;
      }
    });

    setSum(totalSum);
    setRahulspent(rahulSum);
    setRameshspent(rameshSum);
  };

  const success = () => {
    setShowForm(false);
  };
  const cancel = () => {
    setShowForm(false);
  };

  return (
    <>
      <header id="page-Header">Expense Tracker</header>
      <button id="Add-Button" onClick={() => setShowForm(true)}>
        Add
      </button>
      {showform && (
        <div className="form">
          <ExpenseTracker onTrue={success} onClose={cancel} />
        </div>
      )}
      <>
        <div className="use-inline date header-color">Date</div>
        <div className="use-inline header-color">Product Purchased</div>
        <div className="use-inline price header-color">Price</div>
        <div className="use-inline header-color" style={{ width: 112 }}>
          Payee
        </div>
      </>
      {items &&
        items.map((user, idx) => (
          <div key={idx}>
            <div className="use-inline date">{user.setDate}</div> {/* Updated here */}
            <div className="use-inline">{user.product}</div>
            <div className="use-inline price">{user.price}</div>
            <div className={`use-inline ${user.payeeName}`}>
              {user.payeeName}
            </div>
          </div>
        ))}
      <hr />
      <div className="use-inline ">Total: </div>
      <span className="use-inline total">{sum.toFixed(2)}</span> <br />
      <div className="use-inline ">Rahul paid: </div>
      <span className="use-inline total Rahul">{rahulspent.toFixed(2)}</span> <br />
      <div className="use-inline ">Ramesh paid: </div>
      <span className="use-inline total Ramesh">{rameshspent.toFixed(2)}</span> <br />
      <span className="use-inline payable">
        {rahulspent > rameshspent ? "Pay Rahul " : "Pay Ramesh"}
      </span>
      <span className="use-inline payable price">
        {" "}
        {Math.abs((rahulspent - rameshspent) / 2).toFixed(2)}
      </span>
      {error && <>{error?.message}</>}
    </>
  );
}

export default ShowData;
