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
      <a href="https://discord.com/invite/W22Ga2R">discord</a>
      <Link to="/keybinding">keybinding</Link>
    </div>
  );
};

export default Header;
