import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [friends,setfriends]=useState(initialFriends)
  const [Addfriend, SetAddfriend] = useState(false);
  const [selectedFrnd,SetSelectedFrnd]=useState(null)
  function HandleAddFriend() {
    SetAddfriend((show) => !show);
  }
  function HandleSetSelectedFrnd(friend){
    SetSelectedFrnd((cur)=>(cur?.id===friend?.id? null : friend))
    SetAddfriend(false)
  }
  function handleSplitBill(value){
    setfriends((friends)=>
      friends.map((friend)=>friend.id===selectedFrnd.id ?
         {...friend,balance:friend.balance+value} :
         friend));
  }
  return (
    <div className="app">
      <div className="sidebar">
        <Friendslist friends={friends} 
        selectedFrnd={selectedFrnd}
        onSelection={HandleSetSelectedFrnd}/>
        {Addfriend && <FormAddFriend />}
        <Button onClick={HandleAddFriend}>
          {Addfriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFrnd && <FormSplitBill selectedFrnd={selectedFrnd}
      onSplitBill={handleSplitBill}/>}
    </div>
  );
}
function Friendslist({friends,onSelection,selectedFrnd}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} 
        selectedFrnd={selectedFrnd}
        onSelection={onSelection}/>
      ))}
    </ul>
  );
}
function Friend({ friend ,onSelection,selectedFrnd}) {
  const isSelected= (selectedFrnd?.id===friend.id);
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You own {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={()=>onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend() {
   const [name, Setname] = useState("");
   const [image, Setimage] = useState("https://i.pravatar.cc/48?u=48");
   function HandleSubmit(e) {
    e.preventDefault();
   if(!name || !image) return ;
  const id = crypto.randomUUID();
  const newFrnd = {
    id,
    name,
    image:`${image}?=${id}` ,
    balance: 0,
  };
  console.log(newFrnd)
  Setname("")
  Setimage("https://i.pravatar.cc/48?u=48")
}
  return (
    <form className="form-add-friend" 
    onSubmit={HandleSubmit}
    >
      <span style={{ fontWeight: 500 }}>👩🏼‍🤝‍🧑🏼Friend Name</span>
      <input
        type="text"
         value={name}
         onChange={(e) => Setname(e.target.value)}
      />

      <label>🌆Image Url</label>
      <input
        type="text"
         value={image}
         onChange={(e) => Setimage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({selectedFrnd,onSplitBill}) {
  const [bill,Setbill]=useState("");
  const [paidbyUser,SetpaidbyUser]=useState("");
  const paidbyFrnd=bill ? bill-paidbyUser : "";
  const [whoispaying,Setwhoispaying]=useState("user");
  onSplitBill(whoispaying==="user"? paidbyFrnd : -paidbyUser)
  function HandleSubmit(e){
    e.preventDefault();
    if(!bill || !paidbyUser) return;
  }
  
  return (
    <form className="form-split-bill" onSubmit={HandleSubmit}>
      <h2>Split A bill with {selectedFrnd.name}</h2>
      <label>💰Bill value</label>
      <input type="text"
      value={bill}
      onChange={(e)=>Setbill(Number(e.target.value))} />
      <label>👨Your Expense</label>
      <input type="text"
      value={paidbyUser}
      onChange={(e)=>SetpaidbyUser(
        Number(e.target.value)> bill? paidbyUser : Number(e.target.value))} />
      <label>👭{selectedFrnd.name}'s Expense</label>
      <input type="text" disabled value={paidbyFrnd}/>
      <label>🤑 Who is paying the bill</label>
      <select
         value={whoispaying}
       onChange={(e)=>Setwhoispaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFrnd.name}</option>
      </select>
      <Button >split bill</Button>
    </form>
  );
}
