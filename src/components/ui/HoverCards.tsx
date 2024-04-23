
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { IconCurrencySolana } from "@tabler/icons-react";

export const OngoingGameCard = ({
  items,
  className,
}: {
  items: {
    id: string;
    game_type: string;
    game_image_url: string;
    staked_game: boolean;
    staked_value?: string | null;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef, // remove this if your container is not fixed height
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
   <div  className={cn("h-[calc(100vh-10rem)] items-start overflow-y-auto w-full ")} ref={gridRef}>
     <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-5 overflow-y-auto",
        className
      )}
      ref={gridRef}
    >
      {items.map((item, idx) => (
        <motion.div
        style={{ y: translateFirst }} // Apply the translateY motion value here
        key={"grid-1" + idx}
        >
                 <div className="p-2 h-full w-full">

          <Card key={item.id} className=" hover:cursor-pointer">
            <img className="w-20 h-20 mr-4 rounded-full self-center" src={`${item.game_image_url}`}/>
        
            <div>
            <CardDescription className="w-8/10 lg:text-2xl md:text-xl sm:text-md">{item.game_type.toUpperCase()}</CardDescription>
            <div className="flex flex-col mt-1">

            <div className="flex flex-row">
            <div className="mr-3 text-zinc-100 font-bold">
              {item.staked_game ? "Staked Game" : "Normal"}
            </div>

            {item.staked_game ? <div className="flex flex-row text-zinc-100">
              <span className="mr-0.5">{item.staked_value}</span>
              <span><IconCurrencySolana/></span>
               </div> : <div></div>}

           
            </div>

            <div className="w-30 h-15 mt-1 items-end">
               <button className="btn btn-outline btn-error">Spectate game</button>
               </div>

            </div>
            </div>
         
          </Card>
       </div>
        </motion.div>
      ))}
    </div>
   </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl h-full w-full p-1 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700",
        className
      )}
    >
      <div>
        <div className="p-1 w-full flex flex-row">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold  mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-3 text-zinc-400  text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
