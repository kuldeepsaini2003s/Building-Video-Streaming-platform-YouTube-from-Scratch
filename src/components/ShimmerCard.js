import React from 'react'

const ShimmerCard = () => {
  return (
    <div className="flex  pl-16 pt-0 flex-wrap gap-x-4 gap-y-8 p-4">
        {/* video-container */}

        {Array(30)
          .fill(" ")
          .map((e, index) => (
            <div key={index}>
              <div>
                {/* img */}
                <div className="shimmer h-[35vh] w-[28vw] rounded-xl bg-gray"></div>

                <div className="flex p-2 gap-3">
                  {/* channdel */}
                  <div className="shimmer bg-[#E3E3E3] rounded-full p-4 w-5 h-5"></div>
                  {/* title */}
                  <div className="flex flex-col gap-2">
                    <div className="shimmer bg-[#E3E3E3] rounded-sm h-5 w-[17rem]"></div>
                    <div className="shimmer bg-[#E3E3E3] rounded-sm h-5 w-[11rem]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
  )
}

export default ShimmerCard