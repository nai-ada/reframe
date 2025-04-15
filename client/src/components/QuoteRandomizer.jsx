import LotusIcon from "../assets/images/lotus.svg";

function QuoteRandomizer() {
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const quotes = [
    "You are capable of amazing things.",
    "Every day is a new opportunity to grow and be better than you were yesterday.",
    "Your positive energy is contagious—spread it everywhere you go.",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "You are enough just as you are. Embrace your uniqueness and let it shine.",
    "The more you praise and celebrate your life, the more there is in life to celebrate.",
    "Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.",
    "Happiness is not something ready-made. It comes from your own actions.",
    "You have the power to create the life you want. Start today, one small step at a time.",
    "Surround yourself with those who bring out the best in you, not the stress in you.",
  ];

  const dailySeed = currentDate.toISOString().slice(0, 10);
  const randomIndex = Math.abs(hashCode(dailySeed)) % quotes.length;
  const dailyQuote = quotes[randomIndex];

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  return (
    <>
      <div className="justify-left flex mt-2 p-4 items-center ">
        <img
          src={LotusIcon}
          alt="lotus icon"
          className="w-[20px] items-center mr-1 mb-[0.2rem]"
        ></img>
        <p className="text-[14px]">{formattedDate}</p>
      </div>
      <div className="gradient-border flex m-4 mt-2 border-2 rounded-xl border-[#b2d9db] mb-10">
        <div className="justify-center p-8 ">
          <p className="text-[20px] italic text-center font-extralight">
            "{dailyQuote}"
          </p>
        </div>
      </div>
    </>
  );
}

export default QuoteRandomizer;
