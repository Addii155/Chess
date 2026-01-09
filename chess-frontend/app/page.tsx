import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className='w-screen h-screen flex justify-center items-center bg-gray-200'>
     <div className='grid grid-cols-1 md:grid-cols-2'>
       <div className='w-full h-full flex flex-col justify-center items-center'>
        <img src={'/chessboard.jpeg'} alt="Chessboard" className='w-full h-full object-cover'/>
      </div>
      <div className='w-full h-full justify-center items-center flex flex-col'> 
        <Link href='/room/1234'>
        <button  className='bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Play Online
        </button>
        </Link>
      </div>
     </div>
    </div>
    </>
  );
}
