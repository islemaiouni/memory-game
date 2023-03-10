import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useGetMediumArticles, {
  PokeObject,
} from "services/customHooks/useStatePokemon";
import "react-toastify/dist/ReactToastify.min.css";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function Home() {
  const [pokeData, setPokeData] = useGetMediumArticles();
 
  const checkIsMatched = async (
    tempArray: Array<PokeObject>,
    arrayId: number
  ) => {
    await delay(900);
    if (pokeData.firstPick !== null) {
      const isMatched =
        tempArray[pokeData.firstPick]["id"] === tempArray[arrayId]["id"] &&
        arrayId !== pokeData.firstPick
          ? true
          : false;
      const count = isMatched ? pokeData.matches + 1 : pokeData.matches;
      tempArray[arrayId]["isOpen"] = isMatched;
      tempArray[pokeData.firstPick]["isOpen"] = isMatched;
      tempArray[arrayId]["isMatched"] = isMatched;
      tempArray[pokeData.firstPick]["isMatched"] = isMatched;
      setPokeData({
        ...pokeData,
        pokemonList: tempArray,
        firstPick: null,
        matches: count,
        isPaused: false,
      });
    }
  };

  const toggleOpen = async (arrayId: number) => {
    let tempArray = pokeData.pokemonList;
    const firstPick = pokeData.firstPick ? pokeData.firstPick : arrayId;
    const isPaused = pokeData.firstPick ? true : false;
    if (!pokeData.isPaused) {
      tempArray[arrayId]["isOpen"] = true;
      setPokeData({
        ...pokeData,
        pokemonList: tempArray,
        firstPick: firstPick,
        isPaused: isPaused,
      });
    }
    if (pokeData.firstPick !== null && !pokeData.isPaused) {
      setPokeData({
        ...pokeData,
        isPaused: true,
      });
      await checkIsMatched(tempArray, arrayId);
    }
  };
  
  
  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div className="hero pt-1 ">
        <div className="hero-content text-center">
          <div className="max-w-md">
          <div className="stats shadow mt-4 rounded-lg">
              <div className="stat">
                <div className="stat-title">Tasks done</div>
                <div className="stat-value">{pokeData.matches}</div>
                <div className="stat-actions">
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => location.reload()}
                  >
                    Restart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex justify-center">
        <div className="grid grid-cols-4 gap-3 max-w-md justify-center">
          {pokeData?.pokemonList?.map((pokemon, index) => (
            <div
              className="min-w-[88px] min-h-[88px] card rounder-lg bg-transparent cursor-pointer group perspective flex justify-center align-middle"
              key={index}
              onClick={() => {
                if (!pokemon.isMatched) toggleOpen(index);
              }}
            >
              <div
                className={`relative preserve-3d bg-base-100 rounded-xl  ${
                  pokemon.isOpen && "group-hover:my-rotate-y-180"
                } w-full h-full duration-1000`}
              >
                <div className="absolute backface-hidden border-2 w-full h-full">
                  <div className="card bg-base-100  p-2 md:p-4 shadow-xl transition duration-500 ease-in-out transform hover:translate-x-3 hover:shadow-lg  cursor-pointer">
                    <figure className="w-full h-full">
                      <Image
                        src={
                          "https://www.pngitem.com/pimgs/m/604-6046515_pokeball-pixel-art-png-transparent-png.png"
                        }
                        alt={"Poke Ball Image"}
                        width={150}
                        height={150}
                      />
                    </figure>
                  </div>
                </div>
                <div
                  className={`absolute my-rotate-y-180 rounded-xl ${
                    !pokemon.isOpen && "backface-hidden"
                  } w-full h-full bg-gray-90 overflow-hidden`}
                >
                  <div className="card bg-base-100 p-2 md:p-4 shadow-xl transition duration-500 ease-in-out transform hover:-translate-x-3 hover:shadow-lg  cursor-pointer">
                    <figure className="w-full h-full">
                      <Image
                        src={pokemon?.image}
                        alt={pokemon.name}
                        width={150}
                        height={150}
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
    

