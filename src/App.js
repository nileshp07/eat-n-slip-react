import {useState} from 'react';

const initialFriends = [
	{
		id: 118836,
		name: 'Clark',
		image: 'https://i.pravatar.cc/48?u=118836',
		balance: -7,
	},
	{
		id: 933372,
		name: 'Sarah',
		image: 'https://i.pravatar.cc/48?u=933372',
		balance: 20,
	},
	{
		id: 499476,
		name: 'Anthony',
		image: 'https://i.pravatar.cc/48?u=499476',
		balance: 0,
	},
];

export default function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleShowAddFriend() {
		setShowAddFriend((showAddFriend) => !showAddFriend);
	}

	function handleSetFriends(friend) {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	}

	function handleSelectedFriend(friend) {
		setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));

		//set the showAddForm to false whenever there is a selectedFriend
		setShowAddFriend(false);
	}

	function handleSplitBill(value) {
		console.log(value);

		//Update the friends array/state to reflect new balances
		setFriends((friends) =>
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? {...friend, balance: friend.balance + value}
					: friend
			)
		);

		//After spliting the bill set the current/selected friend to null: this will close the form-split-bill component
		setSelectedFriend(null);
	}

	return (
		<div className='app'>
			<div className='sidebar'>
				<FriendList
					friends={friends}
					selectedFriend={selectedFriend}
					onSelection={handleSelectedFriend}
				/>

				{showAddFriend && <FormAddFriend onAddFriend={handleSetFriends} />}

				<Button onClick={handleShowAddFriend}>
					{showAddFriend ? 'Close' : 'Add Friend'}
				</Button>
			</div>

			{selectedFriend && (
				<FormSplitBill
					selectedFriend={selectedFriend}
					onSplitBill={handleSplitBill}
				/>
			)}
		</div>
	);
}

function Button({children, onClick}) {
	return (
		<button className='button' onClick={onClick}>
			{children}
		</button>
	);
}

function FriendList({friends, selectedFriend, onSelection}) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					selectedFriend={selectedFriend}
					onSelection={onSelection}
				/>
			))}
		</ul>
	);
}

function Friend({friend, selectedFriend, onSelection}) {
	const isSelected = selectedFriend?.id === friend.id;
	console.log(isSelected);

	return (
		<li className={isSelected ? 'selected' : ''}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>

			{friend.balance < 0 && (
				<p className='red'>
					You owe {friend.name} {Math.abs(friend.balance)} €
				</p>
			)}
			{friend.balance > 0 && (
				<p className='green'>
					{friend.name} owes you {Math.abs(friend.balance)} €
				</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}

			<Button onClick={() => onSelection(friend)}>
				{isSelected ? 'close' : 'Select'}
			</Button>
		</li>
	);
}

function FormAddFriend({onAddFriend}) {
	const [name, setName] = useState('');
	const [image, setImage] = useState('https://i.pravatar.cc/48?u=499476');

	function handleSubmit(e) {
		e.preventDefault();

		const id = crypto.randomUUID();
		const newFriend = {
			id,
			name,
			image: `${image}?=${id}`,
			balance: 0,
		};

		//Pass the newFriend to the onAddFriend prop received form the parent
		onAddFriend(newFriend);
	}

	return (
		<form className='form-add-friend' onSubmit={handleSubmit}>
			<label> 👨🏽‍🤝‍👨🏽Friend Name </label>
			<input
				type='text'
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>

			<label>🖼 Image Url </label>
			<input
				type='text'
				value={image}
				onChange={(e) => setImage(e.target.value)}
			/>

			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({selectedFriend, onSplitBill}) {
	const [bill, setBill] = useState('');
	const [paidByUser, setPaidByUser] = useState('');
	const paidByFriend = bill ? bill - paidByUser : '';
	const [whoIsPaying, setWhoIsPaying] = useState('user');

	function handleSubmit(e) {
		e.preventDefault();

		if (!bill || !paidByUser) return;

		//If user is paying then value will be paidByFriend as friend OWES user , else value will be paidByUser in minus as user OWES friend
		onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
	}

	return (
		<form className='form-split-bill' onSubmit={handleSubmit}>
			<h2>Split a Bill with {selectedFriend.name}</h2>

			<label> 💰 Bill Value </label>
			<input
				type='text'
				value={bill}
				onChange={(e) => setBill(Number(e.target.value))}
			/>

			<label> 🕴 Your Expense </label>
			<input
				type='text'
				value={paidByUser}
				onChange={(e) =>
					setPaidByUser(
						Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
					)
				}
			/>

			<label> 👨🏽‍🤝‍👨🏽 {selectedFriend.name}'s Expense </label>
			<input type='text' disabled value={paidByFriend} />

			<label> 🤑 Who's paying the bill</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}
			>
				<option value='user'>You</option>
				<option value='friend'>{selectedFriend.name}</option>
			</select>
			<Button>Add</Button>
		</form>
	);
}
