import Product from "../../components/product";

const List = () => {
  return (
    // <div className=" flex justify-start items-start w-screen min-h-screen pt-32 ">
    //   <div className="ml-64 w-[calc(100vw-18.4rem)] p-4">
    //     <div className="overflow-auto max-h-[80vh] border rounded-md shadow-md">
    //       <Product />
    //     </div>
    //   </div>
    // </div>
    <div className=" flex justify-start items-start w-screen min-h-screen pt-32 ">
      <div className="w-[calc(100vw-2.7rem)] p-4">
        <div className="overflow-auto max-h-[80vh] border rounded-md shadow-md">
          <Product />
        </div>
      </div>
    </div>
  );
};

export default List;
