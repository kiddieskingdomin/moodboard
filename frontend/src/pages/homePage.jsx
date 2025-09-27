import React from 'react';
import Hero from '../components/hero';
import CategoriesShowcase from '../section/CategoryShowcase';
import WhyKidsLoveUs from '../section/WhyKidsLoveUs';
import CustomPlaysetCallout from '../section/CTAs';
import FeatureIconsRow from '../section/FeaturesIcons';
import Bestsellers from '../section/BestSeller';
import ParentsTrustSection from '../section/ClientVideoReview';
import RealParents from '../section/Testimonial';

const Home = () => {
  return (
    <>
    <Hero/>
    <CategoriesShowcase/>
    <WhyKidsLoveUs/>
    <CustomPlaysetCallout/>
    <FeatureIconsRow/>
    <Bestsellers/>
    <ParentsTrustSection/>
    <RealParents/>
    </>
  );
};

export default Home;
