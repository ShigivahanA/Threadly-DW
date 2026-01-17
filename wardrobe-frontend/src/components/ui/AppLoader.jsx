import {Wardrobe} from '../../../assets/assets'
const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="flex items-center justify-center">        
        <img
          src={Wardrobe}
          alt=""
          className="h-28 w-28 opacity-90"
        />
       

        {/* OPTION 2: Pure CSS abstract loader */}
        {/* <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-black/10 dark:bg-white/10 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-black/20 dark:bg-white/20 animate-[pulse_1.5s_ease-in-out_infinite]" />
          <div className="absolute inset-4 rounded-full bg-black dark:bg-white animate-[pulse_2s_ease-in-out_infinite]" />
        </div> */}

      </div>
    </div>
  )
}

export default AppLoader
