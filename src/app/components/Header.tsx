interface HeaderProps {
  title: string;
  subtitle: string | null;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <>
      <header className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center text-white 
                              hover:text-teal-400 
                              transition-colors duration-300 
                              shadow-lg 
                              transform hover:scale-105 
                              transition-transform duration-500"
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-4 text-xl text-center text-gray-300 
                       hover:text-teal-300 
                       transition-colors duration-300"
            >
              {subtitle}
            </p>
          )}
        </div>
      </header>
    </>
  );
}
