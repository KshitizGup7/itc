import React from 'react'
import Woven from './products/Woven'
import Tufted from './products/Tufted'
import Knotted from './products/Knotted'
import ContactSection from './Contact'
import Footer from '@/components/Footer'

const Products = () => {
  return (
    <div>
        <Woven/>
        <Tufted/>
        <Knotted/>
        <ContactSection/>
        <Footer/>
    </div>
  )
}

export default Products