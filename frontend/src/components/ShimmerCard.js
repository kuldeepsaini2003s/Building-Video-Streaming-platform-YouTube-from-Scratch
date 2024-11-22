import React from 'react'

const ShimmerCard = () => {
  return (
    <div className="shimmer-border flex sm:flex-row ms:flex-col border-t sm:pl-14 flex-wrap sm:gap-x-4 sm:gap-y-8 ms:gap-y-4   border-[#E3E3E3] sm:p-4  ms:py-4">
    {/* video-container */}

    {Array(30)
      .fill(" ")
      .map((e, index) => (
        <div key={index}>
          <div>
            {/* img */}
            <div className="shimmer sm:h-[35vh] sm:w-[28vw] ms:h-[11rem]  sm:rounded-xl bg-gray"></div>

            <div className="flex sm:p-2 sm:px-0 sm:py-2 ms:px-4 ms:py-4 gap-3">
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