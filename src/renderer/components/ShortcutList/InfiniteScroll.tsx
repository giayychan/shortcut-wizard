import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Shortcut } from '../../../../@types';
import ShortcutListItem from './Item';

function ShortcutListInfinityScroll({
  fullItems = [],
}: {
  fullItems: Shortcut[];
}) {
  const increment = 12;
  const [items, setItems] = useState<Shortcut[]>(
    fullItems?.slice(0, increment) || []
  );
  const [hasMore, setHasMore] = useState(true);
  const [endIndex, setEndIndex] = useState(increment);

  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
      setItems(fullItems?.slice(0, increment) || []);
      setEndIndex(increment);
      setHasMore(true);
    };
  }, [fullItems]);

  const fetchData = () => {
    if (items.length >= fullItems.length) {
      setHasMore(false);
      return;
    }

    setItems((prevItems: Shortcut[]) => [
      ...prevItems,
      ...fullItems.slice(items.length ? items.length - 1 : 0, endIndex),
    ]);

    setEndIndex((prevEndIndex) => prevEndIndex + increment);
  };

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>You have reached the last item</b>
        </p>
      }
    >
      {items.map((shortcut) => {
        return <ShortcutListItem shortcut={shortcut} key={shortcut.id} />;
      })}
    </InfiniteScroll>
  );
}

export default ShortcutListInfinityScroll;
