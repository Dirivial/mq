import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

const restaurants = [
  "Umeå",
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Luleå",
  "Uppsala",
  "Linköping",
  "Västerås",
  "Örebro",
  "Helsingborg",
  "Jönköping",
  "Norrköping",
  "Lund",
];

export default function Restaurant() {
  const [search, setSearch] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [restaurantSelected, setRestaurantSelected] = useState<boolean>(false);

  useEffect(() => {
    const results = restaurants.filter((restaurant) =>
      restaurant.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredRestaurants(results);
    if (results.length === 1) {
      setRestaurantSelected(true);
    } else {
      setRestaurantSelected(false);
    }
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (filteredRestaurants.length === 1) {
        setSearch(filteredRestaurants[0] ? filteredRestaurants[0] : search);
      }
    }
  };

  return (
    <>
      <Head>
        <title>MQ - Restaurang</title>
        <meta name="description" content="Välj restaurang" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Välj din restaurang
          </h1>

          <div className="flex flex-row">
            <div className="dropdown">
              <input
                className="input"
                tabIndex={0}
                placeholder="Sök restaurang"
                value={search}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onFocus={() => setIsSearching(true)}
                onBlur={() => setIsSearching(false)}
              ></input>
              <ul
                tabIndex={0}
                className="menu dropdown-content rounded-box z-[1] mt-2 w-52 bg-base-100 p-2 shadow"
              >
                {filteredRestaurants.map((restaurant) => (
                  <li key={restaurant}>
                    <a onClick={() => setSearch(restaurant)}>{restaurant}</a>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/quiz"
              className={
                "btn ml-6 transition-colors duration-300" +
                (restaurantSelected ? " btn-primary" : " btn-disabled")
              }
            >
              Klar!
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
