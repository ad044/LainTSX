import React from "react";
import { Link } from "react-router-dom";
import "../static/css/header.css";

const Header = () => {
  return (
    <div className="header">
      <Link to="/">main</Link>
      <Link to="/notes">notes</Link>
      <Link to="/game">start</Link>
      <Link to="/guide">guide</Link>
      <a href="https://discord.com/invite/JGnEyhD6ah">discord</a>
      <Link to="/options">options</Link>
    </div>
  );
};

export default Header;
