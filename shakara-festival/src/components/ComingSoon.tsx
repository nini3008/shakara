import Image from 'next/image'

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/SHAKARAWhite.png" 
            alt="Shakara Festival"
            width={400}
            height={200}
            priority
            className="mx-auto"
          />
        </div>
        
        {/* Coming Soon Text */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Coming Soon
        </h1>
        
        {/* Date */}
        <p className="text-xl md:text-2xl text-gray-300 mb-2">
          December 18-21, 2025
        </p>
        
        {/* Location */}
        <p className="text-lg md:text-xl text-gray-400">
          Victoria Island, Lagos 🇳🇬
        </p>
      </div>
    </div>
  )
}