import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/constants';
import CourseCard from '../Course/CourseCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCatalogData } from '../../services/operations/CatalogAPI';

const CatalogItem = () => {
    const catalogData=useSelector((store)=>store.catalog?.catalogData || null);
    const { catalogId } = useParams();
    const [allCourses, setAllCourses] = useState([]);
    const [mostSelling, setMostSelling] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // "all" | "mostSelling"

    // Wrapped in useCallback so it can be safely listed in useEffect deps
    // const fetchCatalogData = useCallback(async () => {
    //     if (!catalogId) return;
    //     try {
    //         setIsLoading(true);
    //         setError(null);

    //         const response = await axios.get(
    //             `${BACKEND_URL}/categories/pagedetails/${catalogId}`
    //         );

    //         const data = response.data?.data;
    //         setAllCourses(data?.selectedCategory ?? []);
    //         setMostSelling(data?.mostSellingCourses ?? []);
    //     } catch (err) {
    //         console.error('Failed to fetch catalog data:', err);
    //         setError('Something went wrong. Please try again.');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [catalogId]);
    const dispatch=useDispatch();
    // fetchCatalogData is now stable and safe to include as a dependency
    useEffect(() => {
        if(!catalogData){
            dispatch(
                fetchCatalogData(
                catalogId,
                setError,
                setAllCourses,
                setMostSelling,
                setIsLoading
        ));}
    }, []);

    const displayedCourses = activeTab === 'all' ? allCourses : mostSelling;

    // ── Loading ──────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#000814] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#2C3244] border-t-[#FFD60A] rounded-full animate-spin" />
                    <p className="text-[#AFB2BF] text-sm">Loading courses…</p>
                </div>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-[#000814] flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 text-base">{error}</p>
                <button
                    onClick={()=>{
                        dispatch(
      fetchCatalogData(
        catalogId,
        setError,
        setAllCourses,
        setMostSelling,
        setIsLoading
      )
    )
                    }}
                    className="px-5 py-2 rounded-lg bg-[#FFD60A] text-black font-semibold text-sm
                               hover:bg-yellow-300 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    // ── Main ─────────────────────────────────────────────────────────────────
    return (
        <div className="text-white min-h-screen bg-[#000814]">

            {/* Header Banner */}
            <div className="bg-[#161D29] border-b border-[#2C3244] py-10 px-[8.5vw]">
                <p className="text-[#6B7280] text-sm mb-2">
                    Home / Catalog / <span className="text-[#FFD60A]">Courses</span>
                </p>
                <h1 className="text-3xl font-bold mb-2 text-[#F1F2FF]">All Courses</h1>
                <p className="text-[#AFB2BF] text-sm">
                    {allCourses.length} course{allCourses.length !== 1 ? 's' : ''} available
                </p>
            </div>

            {/* Tabs + Grid */}
            <div className="px-[8.5vw] mt-8">
                <div className="flex gap-6 border-b border-[#2C3244] mb-8">
                    <TabButton
                        label={`All Courses (${allCourses.length})`}
                        active={activeTab === 'all'}
                        onClick={() => setActiveTab('all')}
                    />
                    <TabButton
                        label={`Most Popular (${mostSelling.length})`}
                        active={activeTab === 'mostSelling'}
                        onClick={() => setActiveTab('mostSelling')}
                    />
                </div>

                {displayedCourses.length === 0 ? (
                    <div className="text-center text-[#6B7280] py-20 text-sm">
                        No courses found in this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
                        {displayedCourses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Small helper so tab JSX stays clean ──────────────────────────────────────
function TabButton({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`pb-3 text-sm font-medium transition-all ${
                active
                    ? 'text-[#FFD60A] border-b-2 border-[#FFD60A]'
                    : 'text-[#6B7280] hover:text-[#AFB2BF]'
            }`}
        >
            {label}
        </button>
    );
}

export default CatalogItem;