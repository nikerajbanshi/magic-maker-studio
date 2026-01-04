import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h2>Learner Dashboard</h2>

      <ul>
        <li><Link to="/flashcards">Flashcards</Link></li>
        <li><Link to="/sound-out">Sound It Out</Link></li>
        <li><Link to="/game">Monster Game</Link></li>
      </ul>
    </div>
  );
}
