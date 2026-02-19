import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const CatalogItem = () => {
  const {catalogName,catalogId}=useParams();
  const [catalogData,setCatalogData]=useState(null);
  const [isLoading,setIsLoading]=useState(true);
  
  const fetchCatalogData=async()=>{
    try{
      
    const response=await axios.get("http://localhost:3000/api/v1/course/showAllCategories");
    const allCategories=response.data.Category;

    const matchedCategory=allCategories.find(cat=>cat._id===catalogId);
    setCatalogData(matchedCategory);
    setIsLoading(false);
    }catch(error){
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    fetchCatalogData();
  });

  const link=catalogName;
  return isLoading ? "LOADING" : (
    
    <div className='container bg-[#161D29]'>
        <div className='part-1 h-[260px] py-[5vw] px-[8.5vw] '>
            <div className='sub-part-1 w-1/2 text-white'>
                <h4 className='text-[#838894]'>Home / Catalog / <span className='text-[#FFD60A]'>{catalogData?.name}</span></h4>
                <h1 className='text-3xl'>
                  {catalogData?.name}
                </h1>
                <h4>{catalogData?.description}</h4>
            </div>
        </div>
    </div>
  )
}

export default CatalogItem