import SignCard from "./SignCard.jsx";

export default function SignList({ signs, onOpen }) {
  return (
    <ul className="grid">
      {signs.map((sign) => (
        <SignCard key={sign.id} sign={sign} onOpen={onOpen} />
      ))}
    </ul>
  );
}
