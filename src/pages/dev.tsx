import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { api } from "~/utils/api";
import { type Question, type Category } from "@prisma/client";

export default function Dev() {
  const { data: sessionData } = useSession();

  const { isLoading: questionsLoading, data: questionData } =
    api.question.getAllQuestions.useQuery();

  const createCategory = api.category.createCategory.useMutation({
    onSuccess: (data, _variables, _context) => {
      categoryData?.push(data);
    },
  });

  const removeCategory = api.category.removeCategory.useMutation({
    onSuccess: (data, _variables, _context) => {
      categoryData?.splice(categoryData?.findIndex((x) => x.id === data.id), 1);
    },
  });

  const { isLoading: categoriesLoading, data: categoryData } =
    api.category.getAllCategories.useQuery();

  const [currentTab, setCurrentTab] = useState<number>(0);

  const addCategory = (name: string, color: string) => {
    createCategory.mutate({ name, color });
  };

  const deleteCategory = (id: number) => {
    removeCategory.mutate({ id });
  };

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Dashboard för quizmasters." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            MQ : // dev //
          </h1>

          <div className="join">
            <button
              onClick={() => setCurrentTab(0)}
              className="join-item rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Skapa Kategori
            </button>

            <button
              onClick={() => setCurrentTab(1)}
              className="join-item rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Ta bort kategori
            </button>

            <button
              onClick={() => setCurrentTab(2)}
              className="join-item rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Skapa fråga
            </button>

            <button
              onClick={() => setCurrentTab(3)}
              className="join-item rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Ta bort fråga
            </button>

            <button
              onClick={() => setCurrentTab(4)}
              className="join-item rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Starta Quiz
            </button>

            <button
              onClick={() => setCurrentTab(5)}
              className="join-item rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Konto
            </button>
          </div>

          <div>
            {(questionsLoading || categoriesLoading) && (
              <span className="loading loading-spinner loading-md" />
            )}
            {!questionsLoading && !categoriesLoading && (
              <Tabber
                currentTab={currentTab}
                questions={questionData ? questionData : []}
                categories={categoryData ? categoryData : []}
                addCategory={addCategory}
                deleteCategory={deleteCategory}
              />
            )}
          </div>
        </div>

        <>
          {!questionsLoading &&
            questionData?.map((q, index) => {
              return <div key={index}>{q.content}</div>;
            })}
        </>
      </main>
    </>
  );
}

interface TabberInterface {
  currentTab: number;
  questions: Question[];
  categories: Category[];
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: number) => void;
}

function Tabber(props: TabberInterface) {
  const [mainInput, setMainInput] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  const handleClick = () => {
    // Why did I do it like this
    switch (props.currentTab) {
      case 0:
        props.addCategory(mainInput, "#000000");
      case 1:
        const foundId = props.categories.find((c) => c.name == mainInput)?.id;
        if (foundId) {
          props.deleteCategory(foundId);
        }
    }
    setMainInput("");
  };

  return (
    <div className="flex flex-col gap-y-5">
      <div>
        <DropDownFilterThing
          categories={props.categories}
          questions={props.questions}
          search={mainInput}
          setSearch={setMainInput}
          mode={props.currentTab < 2 ? "category" : "question"}
        />
      </div>

      {props.currentTab == 2 && (
        <div className="w-full">
          <div>
            <input className="input" placeholder="Svar" />
          </div>

          <div className="flex flex-col">
            <input className="input" placeholder="Felaktiga svar" />
          </div>
        </div>
      )}

      <button
        onClick={handleClick}
        className={
          "btn" +
          (props.currentTab % 2 == 0 ? "  btn-primary" : "  btn-warning")
        }
      >
        {(props.currentTab % 2 == 0 && "Spara") || "Ta bort"}
      </button>
    </div>
  );
}

interface DropDownFilterThingInterface {
  categories: Category[];
  questions: Question[];
  mode: "category" | "question";
  search: string;
  setSearch: (search: string) => void;
}

function DropDownFilterThing(props: DropDownFilterThingInterface) {
  const [filteredEntries, setFilteredEntries] = useState<string[]>([]);

  useEffect(() => {
    if (props.mode == "category") {
      const results = props.categories
        .filter((category) => {
          return category.name
            .toLowerCase()
            .includes(props.search.toLowerCase());
        })
        .map((category) => category.name);
      setFilteredEntries(results);
    } else {
      const results = props.questions
        .filter((question) => {
          return question.content
            .toLowerCase()
            .includes(props.search.toLowerCase());
        })
        .map((question) => question.content);
      setFilteredEntries(results);
    }
  }, [props.search, props.mode, props.categories, props.questions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (filteredEntries.length === 1) {
        props.setSearch(filteredEntries[0] ? filteredEntries[0] : props.search);
      }
    }
  };
  return (
    <>
      <div className="dropdown">
        <input
          className="input"
          tabIndex={0}
          placeholder={props.mode == "category" ? "Kategori" : "Fråga"}
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <ul className="menu dropdown-content rounded-box z-[1] mt-2 w-52 bg-base-100 p-2 shadow">
          {filteredEntries.map((entry, index) => (
            <li
              className="dropdown-item rounded-lg p-2 hover:bg-base-200"
              key={index}
              onClick={() => props.setSearch(entry)}
            >
              {entry}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
