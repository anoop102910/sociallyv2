// import React, { useEffect, useState } from 'react';
// import { useInView } from 'react-intersection-observer';

// interface InfinitePaginationProps {
//   fetchData: (page: number) => Promise<any>;
//   renderItems: (items: any[]) => React.ReactNode;
// }

// const InfinitePagination: React.FC<InfinitePaginationProps> = ({ fetchData, renderItems }) => {
//   const [items, setItems] = useState<any[]>([]);
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const { ref, inView } = useInView({
//     threshold: 1.0,
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       const data = await fetchData(page);
//       if (data.length > 0) {
//         setItems(prevItems => [...prevItems, ...data]);
//       } else {
//         setHasMore(false);
//       }
//     };
    
//     loadData();
//   }, [page, fetchData]);

//   useEffect(() => {
//     if (inView && hasMore) {
//       setPage(prevPage => prevPage + 1);
//     }
//   }, [inView, hasMore]);

//   return (
//     <div>
//       {renderItems(items)}
//       <div ref={ref} style={{ height: '1px' }}></div>
//       {!hasMore && <p>No more items</p>}
//     </div>
//   );
// };

// export default InfinitePagination;
