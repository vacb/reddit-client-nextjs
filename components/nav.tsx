import Link from "next/link";
import Select from "react-select";
import { useSession, signIn, signOut } from "next-auth/client";
import { useState, useEffect } from "react";
import router, { useRouter } from "next/router";

export default function Nav() {
  const [session, loading] = useSession();
  const [subreddits, setSubreddits] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const subToOptions = () => {
    if (subreddits.length < 1) return;
    const options = subreddits.map((sub) => ({
      value: sub.id,
      label: sub.name,
    }));
    return options;
  };

  const fetchData = async () => {
    const res = await fetch("/api/subreddit/allSubreddits");
    const subredditsReturned = await res.json();
    // console.log(subredditsReturned);
    setSubreddits(subredditsReturned);
  };

  //   console.log("loading: " + loading);
  //   console.log("session: " + session);
  return (
    <nav className="flex items-center justify-between py-4 bg-gray-600">
      <div className="flex items-center">
        <Link href="/">
          <div className="w-12 h-12 rounded-full bg-red-300 mx-4 cursor-pointer" />
        </Link>
        <Link href="/">
          <a className="text-white text-2xl font-bold hidden md:block">
            reddit
          </a>
        </Link>
      </div>
      <div className="w-full md:w-4/12 mr-4 md:mr-0">
        <Select
          options={subToOptions()}
          onChange={(selected) => {
            router.push(`/subreddits/${selected.label}`);
          }}
        />
      </div>
      <h3 className="text-white text-xl hidden md:block">
        Welcome
        {loading ? "" : !session ? ", friend!" : ", " + session?.user?.name}
      </h3>
      <div>
        {!session && (
          <button
            className="text-white font-bold mr-4 hover:text-indigo-200"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
        {session && (
          <button
            className="text-white font-bold mr-4 hover:text-indigo-200"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
