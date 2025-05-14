import SingleSubCategory from '@/Pages/WebsitePages/SingleSubCategory/SingleSubCategory';
import React from 'react';

export const metadata = {
    title: "Sub Category | ABC Computers",
  };

const SubCategoriesSinglePage = async({params}) => {

    const {id} = await params

    return (
        <>
            <SingleSubCategory id={id}/>
        </>
    );
};

export default SubCategoriesSinglePage;