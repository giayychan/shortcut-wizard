import { BsFillKeyboardFill } from 'react-icons/bs';
import FlippyCard from '../common/FlippyCard';
import useShortcutsSearch from './hooks/useShortcutsSearch';

function SearchBarContainer() {
  const { searchTerm, setSearchTerm, handleSubmit } = useShortcutsSearch();

  return (
    <div className="flex flex-row items-center gap-4 text-xl">
      <FlippyCard
        front={<BsFillKeyboardFill fill="#dddddd" size={24} />}
        back={<BsFillKeyboardFill fill="#dddddd" size={24} />}
      />
      <form onSubmit={handleSubmit} className="w-full">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full placeholder:text-squant bg-chromaphobic-black focus:outline-none text-steam text-[16px]"
        />
      </form>
    </div>
  );
}

export default SearchBarContainer;
