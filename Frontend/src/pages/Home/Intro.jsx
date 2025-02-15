import React from 'react'
// import AboutUs from '../../components/Introduce/AboutUs/AboutUs'
// import Culture from '../../components/Introduce/Culture/Culture'
// import Economic from '../../components/Introduce/Economic/Economic'
import { assets } from '../../assets/assets';
import '../styles/styles.css';
import { motion } from "framer-motion";



const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};


const Introduce = () => {
    return (
        <main>
            <div className='banner-top-img'>
                <img src={assets.introduce} alt="Liên hệ" />
            </div>
            <div className='container'>
                <motion.section
                    className="section_1_forme"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={containerVariants}
                >
                    <div className='container'>
                        <div className="row row_intro">
                            <motion.div
                                className="row_intro_feft col-6"
                                variants={imageVariants}
                            >
                                <img src={assets.forme} alt="" />
                            </motion.div>

                            <motion.div
                                className="row_intro_right col-6"
                                variants={imageVariants}
                            >
                                <img src={assets.about1} alt="" />
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
                {/* <Culture />
                <Economic /> */}
            </div>
        </main>
    )
}

export default Introduce