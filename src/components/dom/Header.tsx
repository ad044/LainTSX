import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="header">
      <Link href="/">
        <a>main</a>
      </Link>
      <Link href="/notes">
        <a>notes</a>
      </Link>
      <Link href="/game">
        <a>start</a>
      </Link>
      <Link href="/guide">
        <a>guide</a>
      </Link>
      <Link href="/options">
        <a>options</a>
      </Link>
    </div>
  );
};

export default Header;
