import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';
import FriendRequestCard from './FriendRequestCard';
import friendRequestsData from '../../data/friend_requests_data.json'

const FriendRequestsScroll = () => {

    const gridRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
      container: gridRef, // remove this if your container is not fixed height
      offset: ["start start", "end start"], // remove this if your container is not fixed height
    });
   
    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);

    const [friendRequests, setFriendRequests] = useState([...friendRequestsData]);
  return (
    <div>
      {
        friendRequests.length === 0 ? <div className="h-[calc(100vh-50rem)] flex flex-col items-center justify-center text-black text-xl">No Friend Requests Here
        {/* <button className="btn btn-outline btn-success mt-2">Go to Profile Section</button> */}
        </div> :   <div
        className={cn("h-[calc(100vh-20rem)] items-start overflow-y-auto w-full")}
        ref={gridRef}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 items-start py-2"
          ref={gridRef}
        >
          <div className="grid gap-10">
            {friendRequests.map((el, idx) => (
              <motion.div
                style={{ y: translateFirst }} // Apply the translateY motion value here
                key={"grid-1-" + idx}
              >
                    <FriendRequestCard username={el.username} user_id={el.user_id} first_name={el.first_name} last_name={el.last_name} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      }
      </div>
  )
}

export default FriendRequestsScroll