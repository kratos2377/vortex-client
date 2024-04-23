import { useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import usersData from '../../data/online_users.json';

export const ParallaxScroll = ({
    className,
  }: {
    className?: string;
  }) => {
    const gridRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
      container: gridRef, // remove this if your container is not fixed height
      offset: ["start start", "end start"], // remove this if your container is not fixed height
    });
   
    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);
   
    const [sortedUsers, setSortedUsers] = useState([...usersData].sort((a, b) => (b.online_status ? 1 : 0) - ( a.online_status ? 1 : 0) ));
    // const third = Math.ceil(images.length / 3);
   
    // const firstPart = images.slice(0, third);
    // const secondPart = images.slice(third, 2 * third);
    // const thirdPart = images.slice(2 * third);


   
    return (
      <div
        className={cn("h-[calc(100vh-10rem)] items-start overflow-y-auto w-9/10", className)}
        ref={gridRef}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 items-start  mx-auto gap-10 py-10 px-10"
          ref={gridRef}
        >
          <div className="grid gap-10">
            {usersData.map((el, idx) => (
              <motion.div
                style={{ y: translateFirst }} // Apply the translateY motion value here
                key={"grid-1" + idx}
              >
   <div className="card card-side bg-slate-700 shadow-xl">
    <div className="flex flex-col item-center justify-center">
  <figure className={`ml-2 my-2 avatar w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2`}><img src={`https://robohash.org/${el.username}`} alt={`${el.username}`}/></figure>
  </div>
  <div className="card-body">
    <div className="text-white w-full text-lg">{el.first_name + " " + el.last_name}</div>
    <p className="text-white">{el.username}</p>
    {el.online_status ? <span className="text-white">🟢</span> : <span className="text-white">◯</span>}
  </div>

</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };