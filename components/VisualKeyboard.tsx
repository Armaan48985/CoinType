export default function VisualKeyboard({ keyPressed }: { keyPressed: string | null }) {
    // Define the keys in rows, including additional keys and spacebar
    const rows = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    ];
  
    return (
      <div className="flex flex-col items-center text-sm pt-6">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-1">
            {row.map((key) => (
              <div
                key={key}
                className={`w-8 h-8 m-[2px] text-opacity-60 flex justify-center items-center rounded-lg text-white 
                ${
                  keyPressed?.toLowerCase() === key
                    ? 'bg-yellow-500 border-yellow-500 text-opacity-100'
                    : 'bg-[var(--primary-blue)]'
                }`}
              >
                {key.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
  
        <div className="flex justify-center mb-2">
          <div
            className={`w-56 h-7 m-[2px] flex justify-center items-center text-opacity-60  rounded-lg text-white
            ${keyPressed === ' ' ? 'bg-yellow-500 border-yellow-500 text-opacity-100' : 'bg-[var(--primary-blue)] border-gray-600'}
          `}
          >
            SPACE
          </div>
        </div>
      </div>
    );
  }
  