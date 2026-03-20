import Hero from '../components/Hero';
import PopularTemplates from '../components/PopularTemplates';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';

const Home = () => {
  return (
    <main>
      <Hero />
      <PopularTemplates activeCategory="all" isSlider={true} />
      <HowItWorks />
      <WhyChooseUs />
      <FAQ />
    </main>
  );
};

export default Home;
